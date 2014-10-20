var TAB_KEY = 'recipeShowTab';

Template.recipe.created = function() {
  if (Router.current().params.activityId)
    Session.set(TAB_KEY, 'feed');
  else
    Session.set(TAB_KEY, 'recipe');
}

Template.recipe.helpers({
  isActiveTab: function(name) {
    return Session.equals(TAB_KEY, name);
  },
  bookmarked: function() {
    return Meteor.user() && _.include(Meteor.user().bookmarkedRecipeIds, this._id);
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
    
    Meteor.call('bookmarkRecipe', this._id);
  },

  'click .js-remove-bookmark': function(e) {
    e.preventDefault();

    Meteor.call('unbookmarkRecipe', this._id);
  },
  
  'click .js-show-recipe': function() {
    Session.set(TAB_KEY, 'make');
  },
  
  'click .js-show-feed': function() {
    Session.set(TAB_KEY, 'feed');
  },
  
  'click .js-uncollapse': function() {
    Session.set(TAB_KEY, 'recipe');
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
  },
  
  'click .js-open': function(event) {
    // On Cordova, open the link in the system browser rather than In-App
    if (Meteor.isCordova) {
      event.preventDefault();
      window.open(event.target.href, '_system');
    }
  }
});