const ErrorDisplay = require('../../show_errors');

const SignupForm = Backbone.View.extend({
  el: 'form.new-member-form',

  events: {
    submit: 'submit',
  },

  initialize(options = {}) {
    this.apiHost = options.apiHost || '';
    this.$('.selectize').selectize();
  },

  submit(e) {
    e.preventDefault();
    const payload = this.formatFormData($(e.target).serializeArray());
    console.log('payload', payload, `${this.apiHost}/api/members`);

    $.post(
      `${this.apiHost}/api/members`,
      payload,
      this.success.bind(this),
      'json'
    ).fail(this.failure.bind(this));
  },

  formatFormData(input) {
    let output = {};
    _.each(input, function(pair) {
      output[pair.name] = pair.value;
    });
    return output;
  },

  success(e, resp) {
    this.$('.new-member-form__thank-you').removeClass('hidden-irrelevant');
    this.$('.form__group').addClass('invisible');
  },

  failure(resp) {
    ErrorDisplay.show({ target: this.$el }, resp);
  },
});

module.exports = SignupForm;
