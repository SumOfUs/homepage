const SweetPlaceholder = Backbone.View.extend({

  el: '.sweet-placeholder',

  events: {
    'focus .sweet-placeholder__field': 'focus',
    'blur  .sweet-placeholder__field': 'blur',
    'change select.sweet-placeholder__field': 'focus',
    'click .sweet-placeholder__label': 'fauxcus',
  },

  focus(e) {
    var $label = this.rootEl(e.target).find('.sweet-placeholder__label');
    $label.addClass('sweet-placeholder__label--active');
  },

  blur(e) {
    var $field = this.rootEl(e.target).find('.sweet-placeholder__field'); 
    var $label = this.rootEl(e.target).find('.sweet-placeholder__label');
    $label.removeClass('sweet-placeholder__label--active');
    if($field.val().length === 0) {
      $label.removeClass('sweet-placeholder__label--full');
    } else {
      $label.addClass('sweet-placeholder__label--full');
    }
  },

  fauxcus(e) {
    this.rootEl(e.target).find('.sweet-placeholder__field').focus();
    if (this.rootEl(e.target).find('.selectize').length){
      this.$('.selectize')[0].selectize.open();
    }
  },

  rootEl(target) {
    return this.$(target).parents('.sweet-placeholder');
  },
});

module.exports = SweetPlaceholder;
