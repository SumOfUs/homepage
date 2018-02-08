const selectTemplate = require('./select_template.js');
const formatCurrency = require('./format_currency.js');
const roundPercentile = require('./round_percentile.js');

const RowTemplate = function(type, source, model, currency) {
  const sourceTitle = I18n.t(`pages.${type}.${source}`);
  var openTag = `<tr><td>${sourceTitle}</td>`;
  const emptyCell = `<td class="right-align"></td>`;
  _.each(['_2016','_2015','_2014'], function(year){
    var tag = `<td class="right-align">${formatCurrency(model[year][source], currency)}</td>`;
    var percentCell = `<td class="right-align">${roundPercentile(model[year][source], model[year]['total'], 1)}%</td>`
    var tags = (source === 'total' ? tag.concat(emptyCell) : tag.concat(percentCell));
    openTag = openTag.concat(tags);
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

  return `<table class="funds-report-table ${type}-table">
    <tbody>
      <tr>
        <th>
          ${selectTemplate(type, currency)}
        </th>
        <th>2016</th>
        <th></th>
        <th>2015</th>
        <th></th>
        <th>2014</th>
        <th></th>
      </tr>
      ${sourcesRows}
    </tbody>
  </table>`;
}

module.exports = TableTemplate;
