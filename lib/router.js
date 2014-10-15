Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});


// XXX: not sure whether to use route controllers or not
HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('featuredRecipes');
    Meteor.subscribe('feed');
  }
});

RecipesController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('allRecipes');
  },
  data: function() {
    return Recipes.find();
  }
});

BookmarksController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('bookmarks');
    var recipeIds = Bookmarks.forUser(Meteor.userId()).map(function(b) {
      return b.recipeId;
    });
    Meteor.subscribe('recipesById', recipeIds);
  },
  data: function() {
    // XXX: better pattern for all this
    var recipeIds = Bookmarks.forUser(Meteor.userId()).map(function(b) {
      return b.recipeId;
    });
    return Recipes.find({_id: {$in: recipeIds}});
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
  this.route('recipes');
  this.route('bookmarks');
  this.route('about');
  
  // XXX: should we use a 'proper' naming scheme like recipesShow?
  this.route('recipe', {path: '/recipes/:_id'});
});

Router.onBeforeAction('dataNotFound');