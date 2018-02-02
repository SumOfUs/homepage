const formatCurrency = function(money, currency) {
  // make money a string and format it appropriately to the currency
  switch (currency) {
    case 'EUR':
      return AccountingJs.formatMoney(money, { symbol: "€", precision: 0 });
      break;
    case 'GBP':
      return AccountingJs.formatMoney(money, { symbol: "£", precision: 0 });
      break;
    default:
      return AccountingJs.formatMoney(money, { precision: 0});
  }
}

module.exports = formatCurrency;
