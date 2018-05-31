const ErrorDisplay = require('../../show_errors');
const SUBSCRIPTION_STATUS_URI = 'https://k1aypoj608.execute-api.us-east-1.amazonaws.com/prod/member';

const UnsubscribeForm = Backbone.View.extend({

  el: 'form.unsubscribe-form',

  events: {
    'submit': 'submit',
  },

  initialize() {
    window.el = this;
    this.setMailingId();
    this.setSource();
  },

  setMailingId() {
    let akid = this.getURLParameter('akid');
    if(typeof(akid) === 'string') {
      let mailingId = akid.split('.')[0];
      this.$('input[name="mailing_id"]').val(mailingId);
    }
  },

  setSource() {
    let source = this.getURLParameter('source');
    if (source) {
      this.$('input[name="source"]').val(source);
    }
  },

  // from http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513
  getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
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
