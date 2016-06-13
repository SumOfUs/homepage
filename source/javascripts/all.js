var $actions = $('.actions');

var template = _.template(
  $('script.template').html()
);

var socket = io('http://live-actions-production.cwctan5wfu.us-west-2.elasticbeanstalk.com' );

socket.on('actions', function(msg){
  var data = JSON.parse(msg);

  var actionHtml = $(template(data));

  $actions.prepend(actionHtml);

  actionHtml.fadeIn(function(){
    $('.card:gt(50)').remove();
  });
});


