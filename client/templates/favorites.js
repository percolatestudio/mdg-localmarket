Template.favorites.helpers({
  favoriteRecipes: function() {
    return Recipes.favorite();
  },
  
  recipeCount: function() {
    return pluralize(Recipes.favorite().count(), 'recipe');
  }
});