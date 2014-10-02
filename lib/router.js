Router.configure({layoutTemplate: 'appBody'});

// XXX: not sure whether to use route controllers or not
HomeController = RouteController.extend({
  subscriptions: function() {
    return Meteor.subscribe('featuredRecipes');
  }
});

FavoritesController = RouteController.extend({
  subscriptions: function() {
    return Meteor.subscribe('favoriteRecipes');
  }
});

RecipeController = RouteController.extend({
  subscriptions: function() {
    return Meteor.subscribe('recipe', this.params._id);
  },
  data: function() {
    return Recipes.findOne(this.params._id);
  }
});

CategoriesController = RouteController.extend({
  subscriptions: function() {
    return Meteor.subscribe('seasonCounts');
  }  
})

CategoryController = RouteController.extend({
  subscriptions: function() {
    return Meteor.subscribe('seasonRecipes', this.params.name);
  },
  data: function() {
    check(this.params.name, Recipes.ValidSeason);

    return {
      category: Recipes.SEASONS[this.params.name],
      recipes: Recipes.forSeason(this.params.name)
    };
  }
})

Router.map(function() {
  this.route('/', {name: 'home'});
  this.route('/categories');
  this.route('/favorites');
  this.route('/about');
  
  // XXX: should we use a 'proper' naming scheme like recipesShow?
  this.route('/recipes/:_id', {name: 'recipe'});
  this.route('/categories/:name', {name: 'category'});
  
  this.route('/recipes', function() { Router.go('home'); });
});