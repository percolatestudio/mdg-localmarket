Meteor.publish('allRecipes', function() {
  return Recipes.find();
});


Meteor.publish('featuredRecipes', function() {
  return Recipes.featured();
});

Meteor.publish('bookmarkedRecipes', function() {
  check(this.userId, String)
  return Recipes.bookmarked(this.userId);
});

Meteor.publish('recipe', function(id) {
  check(id, String);
  return Recipes.find(id);
});