const Funding = Backbone.Model.extend({
  defaults: {
    _2014: {
      total: 4426005,
      individuals: 3655474,
      foundations: 748712,
      other: 21819,
    },
    _2015: {
      total: 4857359,
      individuals: 4080182,
      foundations: 761250,
      other: 15927,
    },
    _2016: {
      total: 4637815,
      individuals: 3869976,
      foundations: 612728,
      other: 155111,
    }
  }
});

const conversionRates = {
  AUD: {
    _2014: 0.8666,
    _2015: 0.7435,
    _2016: 0.7143,
  },
  CAD: {
    _2014: 0.8703,
    _2015: 0.7524,
    _2016: 0.7252,
  },
  EUR: {
    _2014: 1.2755,
    _2015: 1.0672,
    _2016: 1.0638,
  },
  GBP: {
    _2014: 1.5823,
    _2015: 1.4684,
    _2016: 1.2987,
  },
  USD: {
    _2014: 1,
    _2015: 1,
    _2016: 1,
  }
}


const roundPercentile = function(x, y) {
  return Math.round(100 * (x / y))
}

const selectTemplate = function(selectCurrency){
  var openTag = `<select class="currency-select" name="currency">`
  _.each(Object.keys(conversionRates), function(currency){
    const selected = currency === selectCurrency ? " selected" : ""
    openTag = openTag.concat(`<option${selected}>${currency}</option>`)
    console.log("openTag, ", openTag);
  })
  return openTag.concat(`</select>`);
}

const fundingTableTemplate = function(model, currency) {
  return `<table class="funding-table">
    <tbody>
      <tr>
        <th>
          ${selectTemplate(currency)}
        </th>
        <th>2016</th>
        <th></th>
        <th>2015</th>
        <th></th>
        <th>2014</th>
        <th></th>
      </tr>
      <tr>
        <td>${I18n.t('pages.funding.total')}</td>
        <td class="right-align">${model._2016.total}</td>
        <td></td>
        <td class="right-align">${model._2015.total}</td>
        <td></td>
        <td class="right-align">${model._2014.total}</td>
      </tr>
      <tr>
        <td>${I18n.t('pages.funding.individuals')}</td>
        <td class="right-align">${model._2016.individuals}</td>
        <td class="right-align">${roundPercentile(model._2016.individuals, model._2016.total)}%</td>
        <td class="right-align">${model._2015.individuals}</td>
        <td class="right-align">${roundPercentile(model._2015.individuals, model._2015.total)}%</td>
        <td class="right-align">${model._2014.individuals}</td>
        <td class="right-align">${roundPercentile(model._2014.individuals, model._2014.total)}%</td>
      </tr>
      <tr>
        <td>${I18n.t('pages.funding.foundations')}</td>
        <td class="right-align">${model._2016.foundations}</td>
        <td class="right-align">${roundPercentile(model._2016.foundations, model._2016.total)}%</td>
        <td class="right-align">${model._2015.foundations}</td>
        <td class="right-align">${roundPercentile(model._2015.foundations, model._2015.total)}%</td>
        <td class="right-align">${model._2014.foundations}</td>
        <td class="right-align">${roundPercentile(model._2014.foundations, model._2014.total)}%</td>
      </tr>
      <tr>
        <td>${I18n.t('pages.funding.other')}</td>
        <td class="right-align">${model._2016.other}</td>
        <td class="right-align">${roundPercentile(model._2016.other, model._2016.total)}%</td>
        <td class="right-align">${model._2015.other}</td>
        <td class="right-align">${roundPercentile(model._2015.other, model._2015.total)}%</td>
        <td class="right-align">${model._2014.other}</td>
        <td class="right-align">${roundPercentile(model._2014.other, model._2014.total)}%</td>
      </tr>
    </tbody>
  </table>`;
}


const FundingTable = Backbone.View.extend({
  events: {
    'change .currency-select': 'changeCurrency',
  },

  el: '.funding-table-container',

  model: new Funding(),

  initialize: function() {
    console.log("Initialize");
    // render initial format - default to USD
    this.$el.html(this.template(this.model.toJSON(), 'USD'));
    return this;
  },

  changeCurrency(e) {
    console.log("Change currency!");
    const currency = $('.currency-select option:selected').val()
    const rates = conversionRates[currency];
    var newAttributes = {};
    _.each(this.model.attributes, function(fundingSources, year){
      newAttributes[year] = {};
      _.each(fundingSources, function(amount, source){
        newAttributes[year][source] = Math.round(amount / rates[year])
      });
    });
    console.log("new attributes:", newAttributes);
    const convertedModel = new Funding(newAttributes);
    console.log("CONVERTED MODEL: ", convertedModel);
    this.$el.html(this.template(convertedModel.attributes, currency));
    return this;
  },

  template: fundingTableTemplate,
});

module.exports = FundingTable;
