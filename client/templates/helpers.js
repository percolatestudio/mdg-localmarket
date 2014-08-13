UI.registerHelper('categoryName', function(shortName) {
  return Recipes.SEASON_NAMES[shortName];
});

UI.registerHelper('recipeImage', function(recipe) {
  return '/img/recipes/' + recipe.imageName;
});