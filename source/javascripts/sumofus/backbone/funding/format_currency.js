const AccountingJs = require('accounting-js');

const formatCurrency = function(money, currency) {
  // make money a string and format it appropriately to the currency
  switch (currency) {
    case 'EUR':
      return AccountingJs.formatMoney(money, { symbol: "€", precision: 0 });
    case 'GBP':
      return AccountingJs.formatMoney(money, { symbol: "£", precision: 0 });
    default:
      return AccountingJs.formatMoney(money, { precision: 0});
  }
}

module.exports = formatCurrency;
