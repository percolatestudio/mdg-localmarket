Session.setDefault('emailErrors', {});

Template.emailOverlay.helpers({
  error: function(name) {
    return name + ' ' + Session.get('emailErrors')[name];
  }
});

Template.emailOverlay.events({
  'submit': function(e, template) {
    e.preventDefault();
    
    var name = template.$('[name=name]').val();
    var sender = template.$('[name=sender]').val();
    var recipient = template.$('[name=recipient]').val();
    
    var errors = {};
    if (! name)
      errors.name = 'is required';
    if (! sender)
      errors.sender = 'is required';
    if (! recipient)
      errors.recipient = 'is required';
    Session.set('emailErrors', errors);
  }
});