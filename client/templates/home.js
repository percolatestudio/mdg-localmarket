Template.home.helpers({
  featuredRecipes: function() {
    return Recipes.featured();
  },
  
  activities: function() {
    return Activities.recent();
  }
});