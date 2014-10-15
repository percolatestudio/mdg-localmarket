Template.bookmarks.helpers({
  recipeCount: function() {
    return pluralize(this.count(), 'recipe');
  }
});