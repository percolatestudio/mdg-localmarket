var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var EMAIL_KEY = 'emailOpen';
Session.setDefault(EMAIL_KEY, false);

Template.body.helpers({
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  },
  
  emailOpen: function() {
    return Session.get(EMAIL_KEY) && 'email-open';
  }
});

Template.body.events({
  'click #content-container': function() {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },
  
  'click [data-email]': function(e) {
    Session.set(EMAIL_KEY, true);
    e.stopImmediatePropagation();
  },
  
  'click [data-close-overlay]': function() {
    Session.set(EMAIL_KEY, false);
  }
});