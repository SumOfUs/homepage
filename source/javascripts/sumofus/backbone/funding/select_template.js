const conversionRates = require('./conversion_rates.js');

const selectTemplate = function(type, selectCurrency){
  var openTag = `<select id="${type}-currency-select" class="currency-select" name="currency">`;
  _.each(Object.keys(conversionRates), function(currency){
    const selected = currency === selectCurrency ? " selected" : "";
    openTag = openTag.concat(`<option${selected}>${currency}</option>`);
  })
  return openTag.concat(`</select>`);
}

module.exports = selectTemplate;
