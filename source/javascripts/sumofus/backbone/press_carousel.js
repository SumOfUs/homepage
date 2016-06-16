const PressCarousel = Backbone.View.extend({

  el: '.press-carousel',

  events: {
    'click .press-carousel__logo': 'centerOnClicked',
    'click .press-carousel__arrow--right': 'moveRight',
    'click .press-carousel__arrow--left': 'moveLeft',
  },

  initialize(options = {}) {
    this.$quoteSpace = this.$('.press-carousel__quote');
    let firstLogo = this.$('.press-carousel__logo-group').children().first();
    this.tripleLogos();
    this.centerOn(firstLogo);
  },

  tripleLogos() {
    let $middleGroup = this.$('.press-carousel__logo-group');
    this.$logos = this.$('.press-carousel__logos');
    this.$logos.append($middleGroup.clone());
    this.$logos.prepend($middleGroup.clone());
    let groupWidth = $middleGroup.outerWidth();
    this.$logos.children().first().css('left', `-${groupWidth}px`);
    this.$logos.children().last().css('left', `${groupWidth}px`);
    $middleGroup.css('left', '0px');
  },

  centerOnClicked(e) {
    this.centerOn(this.$(e.target));
  },

  moveLeft() {
    let $current = this.$('.press-carousel__logo--highlighted');
    var $next;
    if ($current.index() === 0) {
      $next = $current.parent().prev().children().last();
    } else {
      $next = $current.prev();
    }
    this.centerOn($next);
  },

  moveRight() {
    let $current = this.$('.press-carousel__logo--highlighted');
    var $next;
    if ($current.index() === ($current.parent().children().length - 1)) {
      $next = $current.parent().next().children().first();
    } else {
      $next = $current.next();
    }
    this.centerOn($next);
  },

  centerOn($target) {
    // delta is the difference between the current pixel coordinate of the el to center
    //   from the screen center minus half the width of the el to center
    let delta = ($(window).width() / 2) - ($target.width() / 2) - $target.offset().left;
    var positions = [0, 0, 0];
    this.$logos.children().each((ii, el) => {
      let $el = this.$(el);
      let newPosition = $el.position().left + delta;
      $el.css('left', `${newPosition}px`)
      positions[ii] = newPosition;
    });
    this.manageTriplet($target, positions);
    this.highlightLogo($target);
    this.showQuote($target);
  },

  highlightLogo($target) {
    this.$('.press-carousel__logo--highlighted').removeClass('press-carousel__logo--highlighted');
    $target.addClass('press-carousel__logo--highlighted');
  },

  showQuote($target) {
    this.$quoteSpace.text($target.data('quote'));
  },

  manageTriplet($target, positions){
    // the carousel allows contiunuous scrolling in either direction by triplicating the
    // logos, and any time the current centered logo is not in the center group of logos,
    // it moves the group of logos on the far end to the end that doesn't have a buffer
    let $group = $target.parents('.press-carousel__logo-group');
    let index = $group.index();
    let left = positions[index];
    if (index === 0) {
      let $last = $group.parent().children().last().detach();
      $last.css('left', `${left - $group.outerWidth()}px`);
      $group.parent().prepend($last);
    } else if (index === 2) {
      let $first = $group.parent().children().first().detach();
      $first.css('left', `${left + $group.outerWidth()}px`);
      $group.parent().append($first);
    }
  },

});

module.exports = PressCarousel;
