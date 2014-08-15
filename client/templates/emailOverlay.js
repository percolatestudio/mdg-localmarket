Session.setDefault('emailErrors', {});

Template.emailOverlay.helpers({
  errorClass: function(name) {
    return Session.get('emailErrors')[name] && 'error';
  }
});

Template.emailOverlay.events({
  'submit': function(e, template) {
    e.preventDefault();
    
    var errors = {}
    
    _.each(['name', 'sender', 'recipient'], function(field) {
      var value = template.$('[name=' + field + ']').val();

      if (! value)
        errors[field] = true;
    });

    Session.set('emailErrors', errors);
  }
});