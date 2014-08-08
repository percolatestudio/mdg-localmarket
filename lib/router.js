Router.configure({layoutTemplate: 'body'});

// XXX: not sure whether to use route controllers or not
HomeController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('featuredRecipes');
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('categories');
  this.route('favorites');
  this.route('about');
});