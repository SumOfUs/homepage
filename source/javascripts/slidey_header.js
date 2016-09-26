window.Headroom = require('headroom.js');

$(document).ready(function(){
  var $header = $('.header');
  var headroom = new Headroom($header[0], {
    tolerance: 10
  });
  headroom.init();
});



