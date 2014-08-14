Session.setDefault('emailErrors', {});

Template.emailOverlay.helpers({
  error: function(name) {
    return name + ' ' + Session.get('emailErrors')[name];
  }
});

Template.emailOverlay.events({
  'submit': function(e, template) {
    e.preventDefault();
    
    var errors = {}
    
    _.each(['name', 'sender', 'recipient'], function(field) {
      var value = template.$('[name=' + field + ']').val();

      if (! value)
        errors[field] = 'is required';
    });

    Session.set('emailErrors', errors);
  }
});