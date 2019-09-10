
const PoiMap = Backbone.View.extend({

  el: '.poi-map',
  MS_TO_LEAVE_OPEN: 4000,

  initialize(options = {}) {
    this.points = options.points;
    this.points.map(this.addPoint.bind(this));
    window.setInterval(this.cycleBlurb.bind(this), 1000);
    this.openBlurb({target: this.$('.poi-map__point-container').first()});
  },

  addPoint(point) {
    this.$el.append(this.template(point.blurb, point.country, point.x, point.y));
    this.$el.children().last().find('.poi-map__point').on('mouseenter touch', this.openBlurb.bind(this));
  },

  closeBlurbs() {
    this.$('.poi-map__point-highlight, .poi-map__blurb-container').addClass('poi-map--hidden')
    this.$('.poi-map__point-container--active').removeClass('poi-map__point-container--active');
  },

  cycleBlurb() {
    if (Date.now() - this.blurbLastOpened < this.MS_TO_LEAVE_OPEN) { return; }
    let $current = this.$('.poi-map__point-container--active');
    let $next = $current.next();
    if ($next.length === 0) {
      $next = $current.parent().children().first();
    }
    this.openBlurb({target: $next});
  },

  openBlurb(e) {
    this.closeBlurbs();
    let $target = this.$(e.target);
    if(!$target.hasClass('poi-map__point-container')) {
      $target = $target.parents('.poi-map__point-container');
    }
    $target.addClass('poi-map__point-container--active');
    $target.find('.poi-map--hidden').removeClass('poi-map--hidden');
    this.blurbLastOpened = Date.now();
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
