// xcxc dedup
DIMENSIONS = {
  small: '320x350',
  large: '640x480',
  full: '640x800'
};

urlForRecipeImage = function (name, size) {
  size = size || 'large';
  return '/img/recipes/' + DIMENSIONS[size] + '/' + name + '.jpg';
};

var preloadedImageUrls = [];
_.each(["small", "large", "full"], function (size) {
  _.each(RecipesData, function (_, name) {
    preloadedImageUrls.push(urlForRecipeImage(name, size));
  });
});

Template.body.helpers({
  preloadedImageUrls: preloadedImageUrls
});
