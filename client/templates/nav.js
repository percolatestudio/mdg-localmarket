Template.nav.rendered = function() {
  var $nav = this.$('nav');
  $nav.siblings('.content-scrollable').waypoint(function(direction) {
    $nav.toggleClass('scrolled', direction === 'down');
  }, {
    context: '.content-scrollable',
    offset: -200
  });
}