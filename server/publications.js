Meteor.publish('featuredRecipes', function() {
  return Recipes.featured();
});

Meteor.publish('recipe', function(id) {
  check(id, String);
  return Recipes.find(id);
});