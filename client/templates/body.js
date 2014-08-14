var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var EMAIL_KEY = 'emailOpen';
Session.setDefault(EMAIL_KEY, false);

Template.body.helpers({
  transitionOptions: function() { return function(from, to, node) {
    if (to.initiator === 'menu')
      return 'none';
    
    // XXX: use initiator === 'back' for the LTR -- requires support from IR,
    //   coming in near future version
    if (to.path === '/')
      return 'left-to-right';
    else
      return 'right-to-left';
  }},
  
  templateClass: function() {
    return Router._layout.region('main').template();
  },
  
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  },
  
  emailOpen: function() {
    return Session.get(EMAIL_KEY) && 'email-open';
  }
});

Template.body.events({
  'click [data-menu]': function(e) {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
    e.stopImmediatePropagation();
  },

  'click [data-back]': function(e) {
    // XXX: set the back transition via Location.back()
    history.back();
    e.stopImmediatePropagation();
  },
  
  'click #content-container': function() {
    Session.set(MENU_KEY, false);
  },
  
  'click #menu a': function(e) {
    Session.set(MENU_KEY, false);
    
    Router.go($(e.target).attr('href'), {initiator: 'menu'});
    e.stopImmediatePropagation();
    e.preventDefault();
  },

  'click [data-email]': function() {
    Session.set(EMAIL_KEY, true);
  },

  'click [data-close-overlay]': function() {
    Session.set(EMAIL_KEY, false);
  }
});