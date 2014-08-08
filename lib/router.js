Router.configure({layoutTemplate: 'body'});

// XXX: not sure whether to use route controllers or not
HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('featuredRecipes');
  }
});

RecipeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('recipe', this.params._id);
  },
  data: function() {
    return Recipes.findOne(this.params._id);
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('categories');
  this.route('favorites');
  this.route('about');
  
  // XXX: should we use a 'proper' naming scheme like recipesShow?
  this.route('recipe', {path: '/recipes/:_id'});
});