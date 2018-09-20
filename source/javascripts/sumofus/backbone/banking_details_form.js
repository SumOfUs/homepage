const ErrorDisplay = require('../../show_errors');
const POST_API = 'https://rixguajbg3.execute-api.us-east-1.amazonaws.com/dev/details';
const queryString = require('querystring');

const BankingDetailsForm = Backbone.View.extend({

  el: 'form.unsubscribe-form',

  events: {
    'submit': 'submit',
  },

  initialize() {
    window.el = this;
    this.parsedParams = queryString.parse(window.location.search.substr(1));
    this.setEmail();
  },

  setEmail() {
    const email = this.parsedParams.email.replace(' ', '+');
    if(email) {
      this.$('input[name="email"]').val(email);
      this.$('label[for="email"]').addClass('sweet-placeholder__label--full');
    }
  },

  showMessage() {
    $('div.banking_details_form-fields').hide();
    $('div.confirmation-message').show();
  },

  submit(e) {
    e.preventDefault();

    let data = {};

    ['email', 'paypal_email', 'tel_number', 'bank_account_details', 'address', 'name'].forEach( field => {
      data[field] = this.$(`textarea[name="${field}"], input[name="${field}"]`).val();
    });

    data['permission_to_contact'] = this.$('input[name="permission_to_contact"]').prop('checked');

    this.$('.button').addClass("button--disabled");

    $.ajax({
      url: POST_API,
      data: JSON.stringify(data),
      dataType: "json",
      contentType: 'application/json',
      method: 'POST',
    })
    .done( (resp) => this.showMessage() );
  },
});

module.exports = BankingDetailsForm;
