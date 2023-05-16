const conversionRates = require('./conversion_rates.js');
const fundingInfo = require('./funding_info.js');
const TableTemplate = require('./table_template.js');

const Funding = Backbone.Model.extend({
  defaults: fundingInfo,
});

const FundingTable = Backbone.View.extend({
  events: {
    'change #funding-currency-select': 'changeCurrency',
  },
  el: '.funding-table-container',
  model: new Funding(),

  categories: ['total', 'individuals', 'foundations', 'other'],

  conversionRates: conversionRates,

  initialize: function() {
    // render initial format - default to USD
    this.$el.html(
      this.template('funding', this.categories, this.model.attributes, 'USD')
    );
    return this;
  },

  changeCurrency(e) {
    const currency = $('#funding-currency-select option:selected').val();
    const rates = this.conversionRates[currency];
    var newAttributes = {};
    _.each(this.model.attributes, function(sources, year) {
      newAttributes[year] = {};
      _.each(sources, function(amount, source) {
        newAttributes[year][source] = Math.round(amount / rates[year]);
      });
    });
    const convertedModel = new Funding(newAttributes);
    this.$el.html(
      this.template(
        'funding',
        this.categories,
        convertedModel.attributes,
        currency
      )
    );
    return this;
  },

  template: TableTemplate,
});

module.exports = FundingTable;
