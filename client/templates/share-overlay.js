var TWEETING_KEY = 'shareOverlayTweeting';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.shareOverlay.created = function() {
  Session.set(TWEETING_KEY, false);
  Session.set(IMAGE_KEY, null);
}

Template.shareOverlay.helpers({
  errorClass: function(name) {
    return Session.get('emailErrors')[name] && 'error';
  },
  
  attachedImage: function() {
    // XXX: obviously this going to be something cordova-y
    return Session.get(IMAGE_KEY);
  },
  
  tweeting: function() {
    return Session.get(TWEETING_KEY);
  }
});

Template.shareOverlay.events({
  'click .js-attach-image': function() {
    MeteorCamera.getPicture({width: 320}, function(error, data) {
      // XXX: error handling
      if (error)
        alert(error.reason);
      
      Session.set(IMAGE_KEY, data);
    });
  },
  
  'click .js-unattach-image': function() {
    Session.set(IMAGE_KEY, null);
  },
  
  'click [data-image-remove]': function() {
    Session.set(IMAGE_KEY, null);
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
      image: Session.get(IMAGE_KEY),
      date: new Date()
    });
    
    Overlay.close();
  }
});