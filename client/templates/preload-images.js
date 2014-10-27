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
    preloadedImageUrls.push("url(" + urlForRecipeImage(name, size) + ")");
  });
});

head = document.getElementsByTagName('head')[0],
style = document.createElement('style');
style.type = 'text/css';
style.id = 'preload';
style.innerHTML = 'body::before { content: ' + preloadedImageUrls.join(' ') + '; display: none; }';
head.appendChild(style);

