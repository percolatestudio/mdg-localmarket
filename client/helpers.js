UI.registerHelper('categoryName', function(shortName) {
  return Recipes.SEASON_NAMES[shortName];
});

UI.registerHelper('recipeImage', function(options) {
  if (options.hash.recipe)
    return '/img/recipes/' + options.hash.recipe.imageName;
});

Handlebars.registerHelper('activePage', function() {
  // includes Spacebars.kw but that's OK because the route name ain't that.
  var routeNames = arguments;

  return _.include(routeNames, Router.current().route.name) && 'active';
});