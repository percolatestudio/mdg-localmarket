Session.setDefault('emailErrors', {});

Template.emailOverlay.helpers({
  open: function() {
    return Session.equals('emailOpen', true);
  },
  
  recipes: function() {
    // XXX: too much of hack?
    if (this._id)
      return Recipes.find(this._id);
    else
      return this;
  },
  
  errorClass: function(name) {
    return Session.get('emailErrors')[name] && 'error';
  }
});

Template.emailOverlay.events({
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