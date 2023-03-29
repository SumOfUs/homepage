const selectTemplate = require('./select_template.js');
const formatCurrency = require('./format_currency.js');
const roundPercentile = require('./round_percentile.js');
const conversionRates = require('./conversion_rates.js');

// Extract the year from the last key in the conversionRates['AUD'] object. If the parse fails,
// default to using 2021 instead.
const financialsAvailableForYear =
  parseInt(
    Object.keys(conversionRates['AUD'])
      .pop()
      .slice(1)
  ) || 2021;

// Create an array called "years" with three elements, representing the current year
// and the two previous years.
const years = Array.from(
  { length: 3 },
  (_, i) => financialsAvailableForYear - i
);

const RowTemplate = function(type, source, model, currency) {
  const sourceTitle = I18n.t(`pages.${type}.${source}`);
  let tableCells = [`<td class="category">${sourceTitle} </td>`];

  years.forEach(year => {
    const tag =
      source === 'total'
        ? formatCurrency(model[`_${year}`][source], currency)
        : `${formatCurrency(
            model[`_${year}`][source],
            currency
          )} (${roundPercentile(
            model[`_${year}`][source],
            model[`_${year}`]['total'],
            1
          )}%)`;
    tableCells.push(`<td class="right-align">${tag}</td>`);
  });

  return `<tr>${tableCells.join('')}</tr>`;
};

//type is 'funding' or 'expenses', sources are the sources of funding or expenses,
// model is the Backbone model and currency is taken from the currency selector
const TableTemplate = function(type, sources, model, currency) {
  var sourcesRows = '';
  _.each(sources, function(source) {
    sourcesRows = sourcesRows.concat(
      RowTemplate(type, source, model, currency)
    );
  });
  return `
    <table class="funds-report-table ${type}-table">
      <tbody>
        <tr>
          <th class="category">
            ${selectTemplate(type, currency)}
          </th>
          ${years.map(year => `<th>${year}</th>`).join('')}
        </tr>
        ${sourcesRows}
      </tbody>
    </table>`;
};

module.exports = TableTemplate;
