const conversionRates = require('./conversion_rates.js');

const TableTemplate = require('./table_template.js');
const Expenses = Backbone.Model.extend({
  defaults: {
    _2016: {
      total: 4977788,
      campaigns: 4341557,
      ops: 467838,
      fundraising: 168848,
    },
    _2017: {
      total: 5330701,
      campaigns: 4552922,
      ops: 670611,
      fundraising: 107168,
    },
    _2018: {
      total: 6189515,
      campaigns: 4867787,
      ops: 824604,
      fundraising: 497124,
    },
    _2019: {
      total: 5785935,
      campaigns: 4426757,
      ops: 861921,
      fundraising: 497257,
    },
    _2020: {
      total: 6605040,
      campaigns: 5182736,
      ops: 864561,
      fundraising: 557743,
    },
    _2021: {
      total: 8481977,
      campaigns: 6473653,
      ops: 1093845,
      fundraising: 914479,
    },
  },
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
    this.$el.html(
      this.template('expenses', this.categories, this.model.attributes, 'USD')
    );
    return this;
  },

  conversionRates: conversionRates,

  changeCurrency(e) {
    const currency = $('#expenses-currency-select option:selected').val();
    const rates = this.conversionRates[currency];
    var newAttributes = {};
    _.each(this.model.attributes, function(sources, year) {
      newAttributes[year] = {};
      _.each(sources, function(amount, source) {
        newAttributes[year][source] = Math.round(amount / rates[year]);
      });
    });
    const convertedModel = new Expenses(newAttributes);
    this.$el.html(
      this.template(
        'expenses',
        this.categories,
        convertedModel.attributes,
        currency
      )
    );
    return this;
  },

  template: TableTemplate,
});

module.exports = ExpensesTable;
