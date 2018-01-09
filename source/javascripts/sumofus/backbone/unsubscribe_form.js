const ErrorDisplay = require('../../show_errors');

const UnsubscribeForm = Backbone.View.extend({

  el: 'form.unsubscribe-form',

  events: {
    'submit': 'submit',
  },

  initialize() {
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

  submit(e) {
    this.$('.unsubscribe-form__failure').addClass('hidden-irrelevant');
    ErrorDisplay.clearErrors(this.$el);
    if (this.$('input[name="email"]').val().length < 5) {
      ErrorDisplay.showError('email', I18n.t('pages.unsubscribe.is_required'), this.$el, {});
      e.preventDefault();
    }
  },
});

module.exports = UnsubscribeForm;
