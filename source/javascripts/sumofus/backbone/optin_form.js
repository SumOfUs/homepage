const ErrorDisplay = require('../../show_errors');
const queryString = require('querystring');

const OptinForm = Backbone.View.extend({
  el: 'form.optin-form',
  API_PATH: '/eoy_donations/opt_in.json',

  events: {
    submit: 'submit',
  },

  initialize(options) {
    this.apiUrl = (options.apiHost || '') + this.API_PATH;
    window.el = this;
    this.parsedParams = queryString.parse(window.location.search.substr(1));
    this.redirectBasedOnLanguage();
    this.setAkid();
    this.setLang();
    this.setEmail();
  },

  setEmail() {
    const email = this.parsedParams.email.replace(' ', '+');
    if (email) {
      this.$('input[name="email"]').val(email);
      this.$('label[for="email"]').addClass('sweet-placeholder__label--full');
    }
  },

  setLang() {
    const lang = this.parsedParams.lang;
    if (lang) {
      this.$('input[name="lang"]').val(lang);
    }
  },

  setAkid() {
    let akid = this.parsedParams.akid;
    if (akid) {
      this.$('input[name="akid"]').val(akid);
    }
  },

  redirectBasedOnLanguage() {
    const lang = this.parsedParams.lang;
    let akid = this.parsedParams.akid;
    if (lang == 'de' || lang == 'fr' || lang == 'es' || lang == 'pt') {
      location.href = '/' + lang + '/optin/?akid=' + akid;
    }
  },

  optIn(akid, email) {
    return new Promise((resolve, reject) => {
      $.post(this.apiUrl, { email: email, akid: akid }, resp =>
        resolve(resp)
      ).fail(() => reject(false));
    });
  },

  submit(e) {
    e.preventDefault();
    ErrorDisplay.clearErrors(this.$el);
    const email = this.$('input[name="email"]').val();
    const akid = this.$('input[name="akid"]').val();

    if (email.length < 5) {
      ErrorDisplay.showError(
        'email',
        I18n.t('pages.optin.is_required'),
        this.$el,
        {}
      );
      this.$('.optin-form__failure').addClass('hidden-irrelevant');
      return false;
    }

    $('.email_not_found').hide();
    this.$('.button').addClass('button--disabled');

    this.optIn(akid, email)
      .then(resp => {
        let lang = window.I18n.locale;
        let url = '/opted_in';
        if (lang == 'de' || lang == 'fr' || lang == 'es' || lang == 'pt') {
          url = '/' + lang + url;
        }
        window.location.href = url;
      })
      .catch(error => {
        this.$('.optin-form__failure').addClass('hidden-irrelevant');
        $('.email_not_found').show();
        this.$('.button').removeClass('button--disabled');
        return false;
      });
  },
});

module.exports = OptinForm;
