if (Meteor.isClient) {
  Meteor.subscribe('bookmarkCounts', function () {
    // delay subscribing to feed until we have the data needed for
    // the main page
    feedSubscription = Meteor.subscribe('feed');
  });
}

Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound',
  onBeforeAction: function () {
    if (this.ready()) {
      // Handle for launch screen defined in app-body.js
      dataReadyHold.release();
    }
  }
});

dataReadyHold = null;

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();
}

HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('latestActivity');
    Meteor.subscribe('news');
  }
});

FeedController = RouteController.extend({
  onBeforeAction: function() {
//    this.feedSubscription = feedSubscription;
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

AdminController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('news');
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('feed');
  this.route('recipes');
  this.route('bookmarks');
  this.route('about');
  this.route('recipe', {path: '/recipes/:name'});
  this.route('admin', { layoutTemplate: null });
});

Router.onBeforeAction('dataNotFound', {only: 'recipe'});
