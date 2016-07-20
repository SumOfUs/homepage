const SweetPlaceholder = Backbone.View.extend({

  el: '.sweet-placeholder',

  events: {
    'focus .sweet-placeholder__field': 'focus',
    'blur  .sweet-placeholder__field': 'blur',
    'click .sweet-placeholder__label': 'fauxcus',
  },

  focus(e) {
    var $label = this.$(e.target).parent().find('.sweet-placeholder__label');
    $label.addClass('sweet-placeholder__label--active');
  },

  blur(e) {
    var $field = this.$(e.target); 
    var $label = $field.parent().find('.sweet-placeholder__label');
    $label.removeClass('sweet-placeholder__label--active');
    if($field.val().length === 0) {
      $label.removeClass('sweet-placeholder__label--full');
    } else {
      $label.addClass('sweet-placeholder__label--full');
    }
  },

  fauxcus(e) {
    this.$(e.target).parent().find('.sweet-placeholder__field').focus();
  },
});

module.exports = SweetPlaceholder;
