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


// We use `initiator` to drive the page-page transition animation.
//
// We need to differentiate between a few different cases
//   a. A click on a link within the app (R->L transition)
//   b. A click on the app's back button (L->R transition)
//   c. A click on a link in the menu (no transition)
//   d. Navigation via the browser history (fade in-out transition) 
var initiator = null;
Template.appBody.setInitiator = function(init) {
  initiator = init;
}

Iron.Location.onGo(function() {
  Template.appBody.setInitiator('click');
});

// if the user hits back in the app, we want to know that at the next popstate
var goingBack = false;
Template.appBody.goBack = function() {
  goingBack = true;
  Template.appBody.setInitiator('back');
  history.back();
}

Iron.Location.onPopState(function() {
  if (goingBack)
    goingBack = false;
  else
    Template.appBody.setInitiator('history')
});


Template.appBody.rendered = function() {
  this.find("#content-container")._uihooks = {
    insertElement: function(node, next) {
      var $node = $(node);
      
      // short-circuit and just do it right away
      if (initiator === 'menu')
        return $node.insertBefore(next);
      
      if (initiator === 'history') {
        // fade in/out transition XXX: duplicated with email-overlay
        $node
          .hide()
          .insertBefore(next)
          .velocity('fadeIn', {
            duration: ANIMATION_DURATION
          });
        
      } else {
        // side to side transition
        var start = (initiator === 'back') ? '-100%' : '100%';
      
        $.Velocity.hook(node, 'translateX', start);
        $node
          .insertBefore(next)
          .velocity({translateX: [0, start]}, {
            duration: ANIMATION_DURATION,
            easing: 'ease-in-out',
            queue: false
          });
      }
    },
    removeElement: function(node) {
      var $node = $(node);
      
      if (initiator === 'menu')
        return $node.remove();
      
      if (initiator === 'history') {
        $node
          .velocity("fadeOut", {
            duration: ANIMATION_DURATION,
            complete: function() {
              $node.remove();
            }
          });
      } else {
        var end = (initiator === 'back') ? '100%' : '-100%';
      
        $node
          .velocity({translateX: end}, {
            duration: ANIMATION_DURATION,
            easing: 'ease-in-out',
            queue: false,
            complete: function() {
              $node.remove();
            }
          });
      }
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
    Template.appBody.goBack();
    e.stopImmediatePropagation();
    e.preventDefault();
  },

  'click .content-overlay': function(e) {
    Session.set(MENU_KEY, false);
    e.preventDefault();
  },

  'click #menu a': function(e) {
    Template.appBody.setInitiator('menu');
    Session.set(MENU_KEY, false);
  },

  'click [data-email]': function() {
    Session.set(EMAIL_KEY, true);
  },

  'click [data-close-overlay]': function() {
    Session.set(EMAIL_KEY, false);
  }
});