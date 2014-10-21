Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});


// XXX: not sure whether to use route controllers or not
HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('feed');
    Meteor.subscribe('news');
  }
});

RecipesController = RouteController.extend({
  data: function() {
    return Recipes.all();
  }
});

BookmarksController = RouteController.extend({
  onBeforeAction: function() {
    if (Meteor.user())
      Meteor.subscribe('bookmarks');
    else
      Overlay.open('authOverlay');
  },
  data: function() {
    if (Meteor.user())
      return _.values(_.pick(RecipesData, Meteor.user().bookmarkedRecipeNames));
  }
});

RecipeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('recipe', this.params.name);
  },
  data: function() {
    return RecipesData[this.params.name];
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('recipes');
  this.route('bookmarks');
  this.route('about');
  
  // XXX: should we use a 'proper' naming scheme like recipesShow?
  this.route('recipe', {path: '/recipes/:name'});
});

// XXX: we need to either 
//   A) use waitOn
//   B) use in-page loading
//   C) not need to wait due to local data
// see #19
// Router.onBeforeAction('dataNotFound', {only: 'recipe'});