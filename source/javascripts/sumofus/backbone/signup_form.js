const ErrorDisplay = require('../../show_errors');

const SignupForm = Backbone.View.extend({

  el: 'form.new-member-form',
  URL: '//localhost:3000',

  events: {
    'submit': 'submit',
  },

  initialize(options = {}) {
    this.$('.selectize').selectize();
  },

  submit(e) {
    e.preventDefault();
    const payload = this.formatFormData($(e.target).serializeArray());
    $.post(`${this.URL}/api/members`, payload, this.success.bind(this), 'json').fail(this.failure.bind(this));
  },

  formatFormData(input) {
    let output = {}
    _.each(input, function(pair){
      output[pair.name] = pair.value
    });
    return output
  },

  success(e, resp) {
    console.log(e, resp);
  },

  failure(resp) {
    ErrorDisplay.show({target: this.$el}, resp);
  },

});

module.exports = SignupForm;
