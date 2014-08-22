Template.categories.helpers({
  categories: function() {
    return _.map(['spring', 'summer', 'fall', 'winter'], function(x) {
      return Recipes.SEASONS[x];
    });
  },
  
  recipeCount: function() {
    return Counts.get(this.name + '-count');
  }
});