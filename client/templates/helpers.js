UI.registerHelper('categoryName', function(shortName) {
  console.log(shortName)
  return Recipes.SEASON_NAMES[shortName];
})