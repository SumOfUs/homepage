const ErrorDisplay = require('../../show_errors');
const OPTOUT_API_URI = 'https://actions.sumofus.org/eoy_donations/opt_out.json';
const queryString = require('querystring');

const OptoutForm = Backbone.View.extend({
  el: 'form.optout-form',

  events: {
    submit: 'submit',
  },

  initialize() {
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
    if (lang == 'de' || lang == 'fr' || lang == 'es') {
      location.href = '/' + lang + '/optout?akid=' + akid;
    }
  },

  optOut(akid, email) {
    return new Promise((resolve, reject) => {
      $.post(OPTOUT_API_URI, { email: email, akid: akid }, resp =>
        resolve(true)
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
        I18n.t('pages.optout.is_required'),
        this.$el,
        {}
      );
      this.$('.optout-form__failure').addClass('hidden-irrelevant');
      return false;
    }

    $('.email_not_found').hide();
    this.$('.button').addClass('button--disabled');

    this.optOut(akid, email)
      .then(success => {
        let lang = window.I18n.locale;
        let url = '/opted_out';
        if (lang != 'en') {
          url = '/' + lang + url;
        }
        window.location.href = url;
      })
      .catch(error => {
        this.$('.optout-form__failure').addClass('hidden-irrelevant');
        $('.email_not_found').show();
        this.$('.button').removeClass('button--disabled');
        return false;
      });
  },
});

module.exports = OptoutForm;
