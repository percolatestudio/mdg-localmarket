Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound',
  subscriptions: function () {
    Meteor.subscribe('bookmarkCounts');
    
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
  subscriptions: function() {
    return [
      Meteor.subscribe('latestActivity'),
      Meteor.subscribe('news')
    ];
  }
});

FeedController = RouteController.extend({
  subscriptions: function() {
    return this.feedSubscription = Meteor.subscribe('feed');
  }
});

RecipesController = RouteController.extend({
  data: function() {
    return _.values(RecipesData);
  }
});

BookmarksController = RouteController.extend({
  subscriptions: function() {
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
  subscriptions: function() {
    return Meteor.subscribe('recipe', this.params.name);
  },
  data: function() {
    return RecipesData[this.params.name];
  }
});

Router.map(function() {
  this.route('/', {name: 'home'});
  this.route('/feed');
  this.route('/recipes');
  this.route('/bookmarks');
  this.route('/about');
  
  this.route('/recipes/:name', {name: 'recipe'});
  
});

Router.onBeforeAction('dataNotFound', {only: 'recipe'});
