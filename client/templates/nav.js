Template.nav.rendered = function() {
  var $nav = this.$('nav');
  $nav.closest('.page').waypoint(function(direction) {
    $nav.toggleClass('over', direction === 'down');
  }, {
    context: '#content-container',
    offset: -400
  });
}