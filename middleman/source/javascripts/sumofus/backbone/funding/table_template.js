const selectTemplate = require('./select_template.js');
const formatCurrency = require('./format_currency.js');
const roundPercentile = require('./round_percentile.js');

const RowTemplate = function(type, source, model, currency) {
  const sourceTitle = I18n.t(`pages.${type}.${source}`);
  var openTag = `<tr><td class="category">${sourceTitle} </td>`;
  const emptyCell = `<td class="right-align"></td>`;
  _.each(['_2017','_2016','_2015'], function(year){
    var tag = (source === 'total' 
                ? `<td class="right-align">${formatCurrency(model[year][source], currency)}</td>` 
                : `<td class="right-align">${formatCurrency(model[year][source], currency)} (${roundPercentile(model[year][source], model[year]['total'], 1)}%)</td>`
              );
    // var percentCell = `<td class="right-align">${roundPercentile(model[year][source], model[year]['total'], 1)}%</td>`
    // var tags = (source === 'total' ? tag.concat(emptyCell) : tag.concat(percentCell));
    openTag = openTag.concat(tag);
  })
  return openTag.concat(`</tr>`);
}

//type is 'funding' or 'expenses', sources are the sources of funding or expenses,
// model is the Backbone model and currency is taken from the currency selector
const TableTemplate = function(type, sources, model, currency) {
  var sourcesRows = '';
  _.each(sources, function(source) {
    sourcesRows = sourcesRows.concat(RowTemplate(type, source, model, currency));
  });
  console.log('')
  return `<table class="funds-report-table ${type}-table">
    <tbody>
      <tr>
        <th class="category">
          ${selectTemplate(type, currency)}
        </th>
        <th>2017</th>
        <th>2016</th>
        <th>2015</th>
      </tr>
      ${sourcesRows}
    </tbody>
  </table>`;
}

module.exports = TableTemplate;
