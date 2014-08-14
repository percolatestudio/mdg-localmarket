Template.favorites.helpers({
  favoriteRecipes: function() {
    return Recipes.favorite();
  }
});