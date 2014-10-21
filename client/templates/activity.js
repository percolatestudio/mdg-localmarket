Template.activity.rendered = function() {
  var self = this;

  // XXX: See https://github.com/percolatestudio/mdg-recipes/issues/21 for a description of the magic '100' number temporary 'hack'
  // If we're the activity in a list somewhere, scroll us into view
  if (Router.current().params.activityId === self.data._id) {
    var $activity = $(self.firstNode);
    var top = $activity.offset().top;
    var $parent = $(self.firstNode).closest('.content-scrollable');
    var parentTop = $parent.offset().top;
    $parent.scrollTop(top - parentTop);
  }
}

Template.activity.helpers({
  firstName: function() {
    return this.userName.split(' ')[0];
  },
  path: function() {
    return Router.path('recipe', { name: this.recipeName }, 
      { query: { activityId: this._id } })
  }
})
