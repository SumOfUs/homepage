const conversionRates = require('./conversion_rates.js');
const TableTemplate = require('./table_template.js');

const Funding = Backbone.Model.extend({
  defaults: {
    _2014: {
      total: 4426005,
      individuals: 3655474,
      foundations: 748712,
      other: 21819,
    },
    _2015: {
      total: 4857359,
      individuals: 4080182,
      foundations: 761250,
      other: 15927,
    },
    _2016: {
      total: 4637815,
      individuals: 3869976,
      foundations: 612728,
      other: 155111,
    }
  }
});

const FundingTable = Backbone.View.extend({
  events: {
    'change #funding-currency-select': 'changeCurrency',
  },
  el: '.funding-table-container',
  model: new Funding(),

  categories: ['total', 'individuals', 'foundations', 'other'],

  initialize: function() {
    // render initial format - default to USD
    this.$el.html(this.template('funding', this.categories, this.model.attributes, 'USD'));
    return this;
  },

  changeCurrency(e) {
    const currency = $('#funding-currency-select option:selected').val()
    const rates = conversionRates[currency];
    var newAttributes = {};
    _.each(this.model.attributes, function(sources, year){
      newAttributes[year] = {};
      _.each(sources, function(amount, source){
        newAttributes[year][source] = Math.round(amount / rates[year])
      });
    });
    const convertedModel = new Funding(newAttributes);
    this.$el.html(this.template('funding', this.categories, convertedModel.attributes, currency));
    return this;
  },

  template: TableTemplate,
});

module.exports = FundingTable;
