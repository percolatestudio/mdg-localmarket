Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound',
  onBeforeAction: function () {
    Meteor.subscribe('bookmarkCounts');
  }
});

HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('latestActivity');
    Meteor.subscribe('news');
  }
});

FeedController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('feed');
  }
});

RecipesController = RouteController.extend({
  data: function() {
    return _.values(RecipesData);
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
  this.route('feed');
  this.route('recipes');
  this.route('bookmarks');
  this.route('about');
  this.route('recipe', {path: '/recipes/:name'});
});

Router.onBeforeAction('dataNotFound', {only: 'recipe'});