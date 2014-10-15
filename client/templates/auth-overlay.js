Template.authOverlay.events({
  'click .js-signin': function() {
    Meteor.loginWithTwitter();
  }
});