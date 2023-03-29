const conversionRates = require('./conversion_rates.js');
const TableTemplate = require('./table_template.js');

const Funding = Backbone.Model.extend({
  defaults: {
    _2016: {
      total: 4637815,
      individuals: 3869976,
      foundations: 612728,
      other: 155111,
    },
    _2017: {
      total: 5659222,
      individuals: 5272378,
      foundations: 190035,
      other: 196809,
    },
    _2018: {
      total: 5614818,
      individuals: 4858584,
      foundations: 739814,
      other: 16420,
    },
    _2019: {
      total: 5788722,
      individuals: 5339913,
      foundations: 347440,
      other: 101369,
    },
    _2020: {
      total: 7110840,
      individuals: 5604251,
      foundations: 1501115,
      other: 5474,
    },
    _2021: {
      total: 9300233,
      individuals: 7297046,
      foundations: 1982370,
      other: 20817,
    },
  },
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
