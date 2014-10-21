var TAB_KEY = 'recipeShowTab';

Template.recipe.created = function() {
  if (Router.current().params.activityId)
    Session.set(TAB_KEY, 'feed');
  else
    Session.set(TAB_KEY, 'recipe');
}

Template.recipe.rendered = function () {
  this.$('.recipe').touchwipe({
    min_move_y: 50,
    wipeDown: function () {
      if (Session.equals(TAB_KEY, 'recipe'))
        Session.set(TAB_KEY, 'make');
    },
    wipeUp: function () {
      Session.set(TAB_KEY, 'recipe');
    },
    preventDefaultEvents: false
  });
}

Template.recipe.setTab = function(tab) {
  Session.set(TAB_KEY, tab);
}

Template.recipe.helpers({
  isActiveTab: function(name) {
    return Session.equals(TAB_KEY, name);
  },
  bookmarked: function() {
    return Meteor.user() && _.include(Meteor.user().bookmarkedRecipeNames, this.name);
  },
  activities: function() {
    return Activities.find({recipeName: this.name}, {sort: {date: -1}});
  }
});

Template.recipe.events({
  'click .js-add-bookmark': function(e) {
    e.preventDefault();

    if (! Meteor.userId())
      return Overlay.open('authOverlay');
    
    Meteor.call('bookmarkRecipe', this.name);
  },

  'click .js-remove-bookmark': function(e) {
    e.preventDefault();

    Meteor.call('unbookmarkRecipe', this.name);
  },
  
  'click .js-show-recipe': function(event) {
    event.stopPropagation();
    Session.set(TAB_KEY, 'make');
  },
  
  'click .js-show-feed': function(event) {
    event.stopPropagation();
    Session.set(TAB_KEY, 'feed');
  },
  
  'click .js-uncollapse': function() {
    Session.set(TAB_KEY, 'recipe');
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