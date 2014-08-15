Session.setDefault('emailErrors', {});

Template.emailOverlay.helpers({
  recipeIds: function() {
    if (_.isFunction(Router.current().recipeIds))
      return Router.current().recipeIds();
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

    if (errors !== {}) {
      // XXX: sending state?
      Meteor.call('emailRecipes', this.recipeIds, options, function() {
        Session.set('emailOpen', false);
      });
    }
  }
});