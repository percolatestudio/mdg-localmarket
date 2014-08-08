Meteor.publish('featuredRecipes', function() {
  return Recipes.featured();
});