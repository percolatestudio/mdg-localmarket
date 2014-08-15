UI.registerHelper('categoryName', function(shortName) {
  return Recipes.SEASON_NAMES[shortName];
});

UI.registerHelper('recipeImage', function(options) {
  var size = options.hash.size || '640x800';

  if (options.hash.recipe)
    return '/img/recipes/' + size + '/' + options.hash.recipe.imageName;
});

Handlebars.registerHelper('activePage', function() {
  // includes Spacebars.kw but that's OK because the route name ain't that.
  var routeNames = arguments;

  return _.include(routeNames, Router.current().route.name) && 'active';
});