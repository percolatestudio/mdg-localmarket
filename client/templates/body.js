var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var EMAIL_KEY = 'emailOpen';
Session.setDefault(EMAIL_KEY, false);

// XXX: refactor out of here and verso
var renderQueue = [];
// *******************************************
Deps.autorun(function() {
  if (! Router.current())
    return;
  
  var render = {
    path: Router.current().path,
    template: Router._layout.region('main').template()
  };
  
  renderQueue.unshift(render);
});

var transitionWith = function(getType) {
  return function() {
    return function(node) {
      return getType(renderQueue[1], renderQueue[0], node);
    }
  }
}
// *******************************************

Template.body.helpers({
  transition: transitionWith(function(from, to) {
    if (to.path === '/')
      return 'left-to-right';
    else
      return 'right-to-left';
  }),
  
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

  'click #content-container': function() {
    Session.set(MENU_KEY, false);
  },
  
  'click #menu a': function() {
    Session.set(MENU_KEY, false);
  },

  'click [data-email]': function() {
    Session.set(EMAIL_KEY, true);
  },

  'click [data-close-overlay]': function() {
    Session.set(EMAIL_KEY, false);
  }
});