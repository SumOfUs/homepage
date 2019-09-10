const ErrorDisplay = require('../../show_errors');
const SUBSCRIPTION_STATUS_URI = 'https://k1aypoj608.execute-api.us-east-1.amazonaws.com/prod/member';
const queryString = require('querystring');

const UnsubscribeForm = Backbone.View.extend({

  el: 'form.unsubscribe-form',

  events: {
    'submit': 'submit',
  },

  initialize() {
    window.el = this;
    this.parsedParams = queryString.parse(window.location.search.substr(1))
    this.setMailingId();
    this.setSource();
    this.setEmail();
  },

  setEmail() {
    const email = this.parsedParams.email.replace(' ', '+');
    if(email) {
      this.$('input[name="email"]').val(email);
      this.$('label[for="email"]').addClass('sweet-placeholder__label--full');
    }
  },

  setMailingId() {
    const akid = this.parsedParams.akid;
    if(typeof(akid) === 'string') {
      const mailingId = akid.split('.')[0];
      this.$('input[name="mailing_id"]').val(mailingId);
    }
  },

  setSource() {
    const source = this.parsedParams.source;
    if (source) {
      this.$('input[name="source"]').val(source);
    }
  },

  checkExists(email) {

    return new Promise( (resolve, reject) => {
      $.get(
        SUBSCRIPTION_STATUS_URI,
        { email: email },
        (resp) => resolve(true)
      ).fail(
        () => reject(false)
      );
    });
  },

  submit(e) {
    e.preventDefault();
    ErrorDisplay.clearErrors(this.$el);
    const email = this.$('input[name="email"]').val();

    if (email.length < 5) {
      ErrorDisplay.showError('email', I18n.t('pages.unsubscribe.is_required'), this.$el, {});
      this.$('.unsubscribe-form__failure').addClass('hidden-irrelevant');
      return false;
    }

    $('.email_not_found').hide();
    this.$('.button').addClass("button--disabled");

    this.checkExists(email)
      .then( exists => {
        this.undelegateEvents();
        this.$el.trigger('submit');
      }).catch( error => {
        this.$('.unsubscribe-form__failure').addClass('hidden-irrelevant');
        $('.email_not_found').show();
        this.$('.button').removeClass("button--disabled");
        return false;
      });
  },
});

module.exports = UnsubscribeForm;
