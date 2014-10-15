var RECIPE_KEY = 'recipeShow';

Template.recipe.created = function() {
  Session.set(RECIPE_KEY, true);
}

Template.recipe.helpers({
  showRecipe: function() {
    return Session.get(RECIPE_KEY);
  },
  activities: function() {
    return Activities.find({recipeId: this._id}, {sort: {date: -1}});
  }
});

Template.recipe.events({
  'click [data-favorite]': function(e) {
    e.preventDefault();

    // XXX: methods?
    Recipes.update(this._id, {$set: {favorite: true}});
  },

  'click [data-unfavorite]': function(e) {
    e.preventDefault();

    // XXX: methods?
    Recipes.update(this._id, {$unset: {favorite: true}});
  },
  
  'click .js-show-recipe': function() {
    Session.set(RECIPE_KEY, true);
  },
  
  'click .js-show-feed': function() {
    Session.set(RECIPE_KEY, false);
  },

  'click [data-ingredients-trigger]': function(e, template) {
    // XXX: @zol -- we should split velocity out as a separate package and
    //   explicitly depend on it
    template.$('[data-ingredients]').velocity('scroll', {
      container: $('.content-scrollable')
    });
  },
  
  'click .js-share': function() {
    Overlay.open('shareOverlay', this);
  }
});