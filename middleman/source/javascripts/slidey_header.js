window.Headroom = require('headroom.js');

$(document).ready(function(){
  var $header = $('.header');
  if (!$header.hasClass('header--dont-slide') && !$header.hasClass('header--dont-scroll')) {
    var headroom = new Headroom($header[0], {
      tolerance: 10
    });
    headroom.init();
  }
});



