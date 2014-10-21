Template.activity.rendered = function() {
  var self = this;

  // XXX: See https://github.com/percolatestudio/mdg-recipes/issues/21 for a description of the magic '100' number temporary 'hack'
  // If we're the activity in a list somewhere, scroll us into view
  if (Router.current().params.activityId === self.data._id) {
    Meteor.setTimeout(function() {
      self.firstNode.scrollIntoView();
    }, 100);
  }
}

Template.activity.helpers({
  firstName: function() {
    return this.userName.split(' ')[0];
  },
  path: function() {
    return Router.path('recipe', { _id: this.recipeId }, 
      { query: { activityId: this._id } })
  }
})
