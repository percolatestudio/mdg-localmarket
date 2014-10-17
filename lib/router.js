Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});


// XXX: not sure whether to use route controllers or not
HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('featuredRecipes');
    Meteor.subscribe('feed');
    Meteor.subscribe('news');
  }
});

RecipesController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('allRecipes');
  },
  data: function() {
    return Recipes.all();
  }
});

BookmarksController = RouteController.extend({
  onBeforeAction: function() {
    if (Meteor.user())
      Meteor.subscribe('bookmarkedRecipes');
    else
      Overlay.open('authOverlay');
  },
  data: function() {
    return Meteor.user() && Recipes.bookmarked(Meteor.user());
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