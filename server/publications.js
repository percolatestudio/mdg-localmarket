Meteor.publish('featuredRecipes', function() {
  return Recipes.featured();
});

Meteor.publish('favoriteRecipes', function() {
  return Recipes.favorite();
});

Meteor.publish('seasonRecipes', function(name) {
  check(name, String);
  return Recipes.forSeason(name);
});

Meteor.publish('recipe', function(id) {
  check(id, String);
  return Recipes.find(id);
});