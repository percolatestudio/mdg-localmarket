var TWEETING_KEY = 'shareOverlayTweeting';

Template.shareOverlay.created = function() {
  Session.set(TWEETING_KEY, false);
}

Template.shareOverlay.helpers({
  errorClass: function(name) {
    return Session.get('emailErrors')[name] && 'error';
  },
  
  attachedImage: function() {
    // XXX: obviously this going to be something cordova-y
    return Session.get('attachedImage');
  },
  
  tweeting: function() {
    return Session.get(TWEETING_KEY);
  }
});

Template.shareOverlay.events({
  'click .js-attach-image': function() {
    Session.set('attachedImage', true);
  },
  
  'click .js-unattach-image': function() {
    Session.set('attachedImage', false);
  },
  
  'click [data-image-remove]': function() {
    Session.set('attachedImage', false);
  },
  
  'change [name=tweeting]': function(event) {
    Session.set(TWEETING_KEY, $(event.target).is(':checked'));
  },
  
  'submit': function(event, template) {
    event.preventDefault();
    
    var text = $(event.target).find('[name=text]').val()
    
    // XXX: post to twitter
    
    // XXX: methods or allow/deny?
    Activities.insert({
      recipeId: this._id,
      userId: Meteor.userId(),
      text: text,
      date: new Date()
    });
    
    Overlay.close();
  }
});