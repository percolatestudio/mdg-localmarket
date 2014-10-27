pluralize = function(n, thing, options) {
  var plural = thing;
  if (_.isUndefined(n)) {
    return thing;
  } else if (n !== 1) {
    if (thing.slice(-1) === 's')
      plural = thing + 'es';
    else
      plural = thing + 's';
  }

  if (options && options.hash && options.hash.wordOnly)
    return plural;
  else
    return n + ' ' + plural;
}

Handlebars.registerHelper('pluralize', pluralize);

DIMENSIONS = {
  small: '320x350',
  large: '640x480',
  full: '640x800'
};

urlForRecipeImage = function (name, size) {
  size = size || 'large';
  return '/img/recipes/' + DIMENSIONS[size] + '/' + name + '.jpg';
};

UI.registerHelper('recipeImage', function(options) {
  if (!options.hash.recipe)
    return null;
  return urlForRecipeImage(options.hash.recipe.name, options.hash.size);
});

Handlebars.registerHelper('activePage', function() {
  // includes Spacebars.kw but that's OK because the route name ain't that.
  var routeNames = arguments;

  return _.include(routeNames, Router.current().route.name) && 'active';
});
