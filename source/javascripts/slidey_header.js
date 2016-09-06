window.Headroom = require('headroom.js');

$(document).ready(function(){
  var $header = $('.header');
  var headroom = new Headroom($header[0], {
    // offset: $header.outerHeight(),
  });
  headroom.init();
});



