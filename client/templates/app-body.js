var ANIMATION_DURATION = 300;
var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var EMAIL_KEY = 'emailOpen';
Session.setDefault(EMAIL_KEY, false);

// each time the router changes page, wait for it to render, then
//   set up a scroll handler to store scroll position in history
Router.onAfterAction(function() {
  Tracker.afterFlush(function() {
    $('.content-scrollable').scroll(_.debounce(function() {
      var state = Iron.Location.get().options.historyState;
      var scrollTop = $(this).scrollTop();
      // XXX: this causes the router to reroute. This seems wrong. consult
      Iron.Location.replaceState(_.extend({}, state, {lastScrollTop: scrollTop}));
    }, 100));
  });
});

// if we change page due to popState (e.g. back button)
//   check to see
Iron.Location.onPopState(function() {
  var state = this.options.historyState;
  if (state && state.lastScrollTop)
    // we need to wait a) for blaze to render b) for the browser
    Tracker.afterFlush(function() {
      Meteor.setTimeout(function() {
        // grab the last scrollable on the screen 
        //   (the old one will still be transitioning off)
        $('.content-scrollable').eq(-1).scrollTop(state.lastScrollTop);
      }, 0)
    });
});


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
  
  emailOpen: function() {
    return Session.get(EMAIL_KEY) && 'email-open';
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