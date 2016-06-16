let points = [
  {
    blurb: "Home Secretary Theresa May will review the Snooper's Charter.",
    country: 'Britain',
    x: 40,
    y: 16
  },
  {
    blurb: "French parliament bans bee-killing neonicotinoid pesticides.",
    country: 'France',
    x: 43,
    y: 24
  },
  {
    blurb: "Major airlines agree not to ship hunting trophies after Cecil the Lion's death.",
    country: 'Zimbabwe',
    x: 52,
    y: 71
  },
  {
    blurb: "Hood River Country will not allow Nestlé to bottle their water.",
    country: 'Oregon',
    x: 8,
    y: 25
  },
  {
    blurb: "Maxima's campaign against the Conga gold mine project has finally scuttled the project.",
    country: 'Peru',
    x: 15,
    y: 60
  },
  {
    blurb: "FMO pulls funding from Agua Zarca dam project after murder of Berta Cáceres.",
    country: 'Honduras',
    x: 13,
    y: 45
  },
  {
    blurb: "McDonalds agrees to a zero-deforestation palm oil policy.",
    country: "Indonesia",
    x: 83,
    y: 57
  },
  {
    blurb: "Standard Chartered abandons investment in reef-killing mine project.",
    country: "Australia",
    x: 93,
    y: 73
  },
  {
    blurb: "Hugo Boss factory workers have won the right to unionize.",
    country: "Turkey",
    x: 54,
    y: 29
  }
]


const PoiMap = Backbone.View.extend({

  el: '.poi-map',

  initialize(options = {}) {
    this.points = options.points || points;
    this.points.map(this.addPoint.bind(this));
  },

  addPoint(point) {
    this.$el.append(this.template(point.blurb, point.country, point.x, point.y));
    this.$el.children().last().find('.poi-map__point').on('mouseenter touch', this.openBlurb.bind(this));
  },

  closeBlurbs() {
    this.$('.poi-map__point-highlight, .poi-map__blurb-container').addClass('poi-map--hidden')
  },

  openBlurb(e) {
    this.closeBlurbs();
    let $target = this.$(e.target);
    if(!$target.hasClass('poi-map__point-container')) {
      $target = $target.parents('.poi-map__point-container');
    }
    $target.find('.poi-map--hidden').removeClass('poi-map--hidden');
  },

  template(blurb, country, x, y) {
    // this doesn't deal with I18n for now, cause it depends where we want them to edit it
    return `<div class="poi-map__point-container" style="left: ${x}%; top: ${y}%;">
              <div class="poi-map__point"></div>
              <div class="poi-map__point-highlight poi-map--hidden"></div>
              <div class="poi-map__blurb-container poi-map--hidden">
                <div class="poi-map__country">${country}</div>
                <div class="poi-map__blurb">${blurb}</div>
              </div>
            </div>`
  },

});

module.exports = PoiMap;
