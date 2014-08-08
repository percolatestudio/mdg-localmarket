Router.configure({layoutTemplate: 'body'});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('categories');
  this.route('favorites');
  this.route('about');
});