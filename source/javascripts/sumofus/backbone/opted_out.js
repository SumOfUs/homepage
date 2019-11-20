const ErrorDisplay = require('../../show_errors');
const queryString = require('querystring');

const OptedOutPage = Backbone.View.extend({
  el: '#opt_in_link',

  events: {
    click: 'click',
  },

  initialize(options) {
    window.el = this;
    this.parsedParams = queryString.parse(window.location.search.substr(1));
    this.setMemberFirstName();
    this.setOptInUrl();
  },

  setMemberFirstName() {
    const first_name = this.parsedParams.name;

    if (first_name) {
      $('.member_name').html(', ' + first_name);
    } else {
      $('.member_name').html('');
    }
  },

  setOptInUrl() {
    let lang = window.I18n.locale;
    let url = '/optin/?akid=' + this.parsedParams.akid;

    if (lang != 'en') {
      url = '/' + lang + url;
    }
    $('#opt_in_link').attr('href', url);
  },
});

module.exports = OptedOutPage;
