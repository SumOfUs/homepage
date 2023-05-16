const conversionRates = require('./conversion_rates.js');
const expensesInfo = require('./expenses_info.js');

const TableTemplate = require('./table_template.js');
const Expenses = Backbone.Model.extend({
  defaults: expensesInfo,
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
