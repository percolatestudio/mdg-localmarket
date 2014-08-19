Template.categories.helpers({
  categories: function() {
    return _.map(['spring', 'summer', 'fall', 'winter'], function(x) {
      return Recipes.SEASONS[x];
    });
  }
});