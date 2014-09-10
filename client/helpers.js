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

// On Cordova, we'll be running from a file uri so we'll need to
// make our asset paths absolute to the fileuri we're running from
assetPathPrefix = function(path) {
  if (Meteor.isCordova) {
    // strip the trailing / from baseUri if it exists
    var baseUri = document.baseURI.replace(/\/$/, '');
    
    // strip the leading / from the path if it exists
    path = path.replace(/^\//, '');

    return baseUri + '/' + path;
  }

  return path;
}

UI.registerHelper('assetPathPrefix', function(path) {
  return assetPathPrefix(path);
});

UI.registerHelper('recipeImage', function(options) {
  var size = options.hash.size || '640x800';

  if (options.hash.recipe)
    return assetPathPrefix('/img/recipes/' + size + '/' + options.hash.recipe.imageName);
});

Handlebars.registerHelper('activePage', function() {
  // includes Spacebars.kw but that's OK because the route name ain't that.
  var routeNames = arguments;

  return _.include(routeNames, Router.current().route.name) && 'active';
});