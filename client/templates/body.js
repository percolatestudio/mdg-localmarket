var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var EMAIL_KEY = 'emailOpen';
Session.setDefault(EMAIL_KEY, false);


// XXX: this work around until IR properly supports this
//   IR refactor will include Location.back, which will ensure that initator is
//   set 
var nextInitiator = null, initiator = null;
Deps.autorun(function() {
  // add a dep
  Router.current();
  
  initiator = nextInitiator;
  nextInitiator = null;
});



Template.body.helpers({
  transitionOptions: function() { return function(from, to, node) {
    if (to.initiator === 'menu')
      return 'none';
    
    if (initiator === 'back') // should be to.initiator
      return 'left-to-right';

    return 'right-to-left';
  }},

  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  }
});

Template.body.events({
  'click [data-menu]': function(e) {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
    e.stopImmediatePropagation();
    e.preventDefault();
  },

  'click [data-back]': function(e) {
    nextInitiator = 'back';
    
    // XXX: set the back transition via Location.back()
    history.back();
    e.stopImmediatePropagation();
    e.preventDefault();
  },

  'click .content-overlay': function() {
    Session.set(MENU_KEY, false);
    e.preventDefault();
  },

  'click #menu a': function(e) {
    Session.set(MENU_KEY, false);

    Router.go($(e.target).closest('a').attr('href'), {initiator: 'menu'});
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