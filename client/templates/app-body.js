var ANIMATION_DURATION = 300;
var NOTIFICATION_TIMEOUT = 3000;
var MENU_KEY = 'menuOpen';
var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
var CONNECTION_ISSUE_TIMEOUT = 5000;

Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);
Session.setDefault(MENU_KEY, false);

var setHistoryState = function (ourState) {
  var state = Iron.Location.get().options.historyState;
  var newState  = _.extend({}, state, ourState);
  Iron.Location.go(Iron.Location.get().path, {historyState: newState, replaceState: true});
}

// Store {initial: true} on the first history entry we meet
setHistoryState({initial: true});

// each time the router changes page, wait for it to render, then
//   set up a scroll handler to store scroll position in history
Router.onAfterAction(function() {
  Tracker.afterFlush(function() {
    $('.content-scrollable').scroll(_.debounce(function() {
      setHistoryState({lastScrollTop: $(this).scrollTop()})
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

var notifications = new Meteor.Collection(null);

Template.appBody.addNotification = function(notification) {
  var id = notifications.insert(notification);

  Meteor.setTimeout(function() {
    notifications.remove(id);
  }, NOTIFICATION_TIMEOUT);
} 

Meteor.startup(function () {
  // set up a swipe left / right handler
  $(document.body).touchwipe({
    wipeLeft: function () {
      Session.set(MENU_KEY, false);
    },
    wipeRight: function () {
      Session.set(MENU_KEY, true);
    },
    preventDefaultEvents: false
  });

  // Only show the connection error box if it has been 5 seconds since
  // the app started
  setTimeout(function () {
    // Launch screen handle created in lib/router.js
    dataReadyHold.release();

    // Show the connection error box
    Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
  }, CONNECTION_ISSUE_TIMEOUT);
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

  this.find(".notifications")._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .insertBefore(next)
        .velocity("slideDown", { 
          duration: ANIMATION_DURATION, 
          easing: [0.175, 0.885, 0.335, 1.05]
        });
    },
    removeElement: function(node) {
      $(node)
        .velocity("fadeOut", {
          duration: ANIMATION_DURATION,
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
  
  overlayOpen: function() {
    return Overlay.isOpen() ? 'overlay-open' : '';
  },
  
  connected: function() {
    if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
      return Meteor.status().connected;
    } else {
      return true;
    }
  },
  
  notifications: function() {
    return notifications.find();
  }
});

Template.appBody.events({
  'click .js-menu': function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },

  'click .js-back': function(event) {
    Template.appBody.goBack();
    event.stopImmediatePropagation();
    event.preventDefault();
  },
  
  'click a.js-open': function(event) {
    // On Cordova, open links in the system browser rather than In-App
    if (Meteor.isCordova) {
      event.preventDefault();
      window.open(event.target.href, '_system');
    }
  },

  'click .content-overlay': function(event) {
    Session.set(MENU_KEY, false);
    event.preventDefault();
  },

  'click #menu a': function() {
    Template.appBody.setInitiator('menu');
    Session.set(MENU_KEY, false);
  },
  
  'click .js-notification-action': function() {
    if (_.isFunction(this.callback)) {
      this.callback();
      notifications.remove(this._id);
    }
  }
});