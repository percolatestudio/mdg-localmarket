var ANIMATION_DURATION = 300;
var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var EMAIL_KEY = 'emailOpen';
Session.setDefault(EMAIL_KEY, false);

// XXX: remove and replace with MDG's fastclick package when it's released
window.addEventListener('load', function() {
  FastClick.attach(document.body);
}, false);

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


Template.appBody.rendered = function() {
  this.find("#content-container")._uihooks = {
    insertElement: function(node, next) {
      // short-circuit and just do it right away
      if (initiator === 'menu')
        return $(node).insertBefore(next);
      
      var start = (initiator === 'back') ? '-100%' : '100%';
      
      $.Velocity.hook(node, 'translateX', start);
      $(node)
        .insertBefore(next)
        .velocity({translateX: [0, start]}, {
          duration: ANIMATION_DURATION,
          easing: 'ease-in-out',
          queue: false
        });
    },
    removeElement: function(node) {
      if (initiator === 'menu')
        return $(node).remove();
      
      var end = (initiator === 'back') ? '100%' : '-100%';
      
      $(node)
        .velocity({translateX: end}, {
          duration: ANIMATION_DURATION,
          easing: 'ease-in-out',
          queue: false,
          complete: function() {
            $(node).remove();
          }
        });
    }
  };
}


Template.appBody.helpers({
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  },

  connected: function() {
    return Meteor.status().connected;
  }
});

Template.appBody.events({
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

  'click .content-overlay': function(e) {
    Session.set(MENU_KEY, false);
    e.preventDefault();
  },

  'click #menu a': function(e) {
    nextInitiator = 'menu'
    Session.set(MENU_KEY, false);
  },

  'click [data-email]': function() {
    Session.set(EMAIL_KEY, true);
  },

  'click [data-close-overlay]': function() {
    Session.set(EMAIL_KEY, false);
  }
});