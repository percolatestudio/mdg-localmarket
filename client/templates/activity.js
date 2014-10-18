Template.activity.rendered = function() {
  // XXX: scrollIntoView seemingly messes up the L-R transition :-/ we need
  // to fix it
  // If we're the activity in a list somewhere, scroll us into view
  // if (Router.current().params.activityId === this.data._id)
  //   this.firstNode.scrollIntoView();
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
