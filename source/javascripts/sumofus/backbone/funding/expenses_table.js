const conversionRates = require('./conversion_rates.js');
const TableTemplate = require('./table_template.js');
const Expenses = Backbone.Model.extend({
  defaults: {
    _2014: {
      total: 3230875,
      campaigns: 2855182,
      ops: 280345,
      fundraising: 95348,
    },
    _2015: {
      total: 4765579,
      campaigns: 4304197,
      ops: 328136,
      fundraising: 133246,
    },
    _2016: {
      total: 4977788,
      campaigns: 4341557,
      ops: 467838,
      fundraising: 168848,
    }
  }
});

const ExpensesTable = Backbone.View.extend({
  events: {
    'change #expenses-currency-select': 'changeCurrency',
  },
  el: '.expenses-table-container',
  model: new Expenses(),

  categories: ['total', 'campaigns', 'ops', 'fundraising'],

  initialize: function() {
    // render initial format - default to USD
    this.$el.html(this.template('expenses', this.categories, this.model.attributes, 'USD'));
    return this;
  },

  changeCurrency(e) {
    const currency = $('#expenses-currency-select option:selected').val()
    const rates = conversionRates[currency];
    var newAttributes = {};
    _.each(this.model.attributes, function(sources, year){
      newAttributes[year] = {};
      _.each(sources, function(amount, source){
        newAttributes[year][source] = Math.round(amount / rates[year])
      });
    });
    const convertedModel = new Expenses(newAttributes);
    this.$el.html(this.template('expenses', this.categories, convertedModel.attributes, currency));
    return this;
  },

  template: TableTemplate,
});

module.exports = ExpensesTable;
