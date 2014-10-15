Template.shareOverlay.helpers({
  recipes: function() {
    // XXX: too much of hack?
    if (this._id)
      return Recipes.find(this._id);
    else
      return this.recipes;
  },
  
  errorClass: function(name) {
    return Session.get('emailErrors')[name] && 'error';
  },
  
  attachedImage: function() {
    // XXX: obviously this going to be something cordova-y
    return Session.get('attachedImage');
  }
});

Template.shareOverlay.events({
  'click [data-image-attach]': function() {
    Session.set('attachedImage', true);
  },
  
  'click [data-image-remove]': function() {
    Session.set('attachedImage', false);
  },
  
  'submit': function(e, template) {
    e.preventDefault();
    
    var errors = {}, options = {};
    
    _.each(['name', 'sender', 'recipient'], function(field) {
      options[field] = template.$('[name=' + field + ']').val();
      errors[field] = (! options[field]);
    });

    Session.set('emailErrors', errors);

    if (_.all(errors, function(e) { return ! e; })) {
      // XXX: sending state?
      var recipeIds = this.map(function(r) { return r._id; });
      Meteor.call('emailRecipes', recipeIds, options, function() {
        Session.set('emailOpen', false);
      });
    }
  }
});