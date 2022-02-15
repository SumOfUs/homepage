const OptedInPage = Backbone.View.extend({
  initialize(options) {
    window.el = this;
    this.setCurrentYear();
  },

  setCurrentYear() {
    const current_year = new Date().getFullYear();
    $('#current_year').html(current_year);
  },
});

module.exports = OptedInPage;
