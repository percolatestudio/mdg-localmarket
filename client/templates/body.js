var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

Template.body.helpers({
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  }
});

Template.body.events({
  'click': function() {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  }
});