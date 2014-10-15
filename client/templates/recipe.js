var RECIPE_KEY = 'recipeShow';

Template.recipe.created = function() {
  Session.set(RECIPE_KEY, true);
}

Template.recipe.helpers({
  showRecipe: function() {
    return Session.get(RECIPE_KEY);
  },
  bookmarked: function() {
    return !! Bookmarks.findOne({userId: Meteor.userId(), recipeId: this._id});
  },
  activities: function() {
    return Activities.find({recipeId: this._id}, {sort: {date: -1}});
  }
});

Template.recipe.events({
  'click .js-add-bookmark': function(e) {
    e.preventDefault();

    if (! Meteor.userId())
      return Overlay.open('authOverlay');
    
    // XXX: methods? -- check if a bookmark already exists?
    Bookmarks.insert({userId: Meteor.userId(), recipeId: this._id});
    Recipes.update(this._id, {$inc: {bookmarkCount: 1}});
  },

  'click .js-remove-bookmark': function(e) {
    e.preventDefault();

    // XXX: methods? -- check if a bookmark already exists?
    var bookmark = Bookmarks.findOne({userId: Meteor.userId(), recipeId: this._id});
    if (bookmark) {
      Bookmarks.remove(bookmark._id);
      Recipes.update(this._id, {$inc: {bookmarkCount: -1}});
    }
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