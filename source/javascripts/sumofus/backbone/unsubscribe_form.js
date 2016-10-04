const ErrorDisplay = require('../../show_errors');

const UnsubscribeForm = Backbone.View.extend({

  el: 'form.unsubscribe-form',

  events: {
    'submit': 'submit',
  },

  initialize() {
    this.setSource();
    this.setLanguage();
  },

  setSource() {
    let source = this.getURLParameter('source');
    if (source) {
      this.$('input[name="source"]').val(source);
    }
  },

  setLanguage() {
    this.$('input[name="lang"]').val(I18n.currentLocale());
  },

  // from http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513
  getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  },

  submit(e) {
    e.preventDefault();
    this.$('.unsubscribe-form__failure').addClass('hidden-irrelevant');
    ErrorDisplay.clearErrors(this.$el);
    if (this.$('input[name="email"]').val().length < 5) {
      ErrorDisplay.showError('email', I18n.t('pages.unsubscribe.is_required'), this.$el, {});
    } else {
      $.ajax({
        type: this.$el.attr('method'),
        url: this.$el.attr('action'),
        data: this.$el.serialize(),
        success: this.success.bind(this),
        error: this.failure.bind(this),
      });
    }
  },

  success(e, resp) {
    let locale = (I18n.currentLocale() === 'en') ? '' : `/${I18n.currentLocale()}`;
    window.location.href = `${locale}/unsubscribed`;
  },

  failure(resp) {
    this.$('.unsubscribe-form__failure').removeClass('hidden-irrelevant');
  },
});

module.exports = UnsubscribeForm;
