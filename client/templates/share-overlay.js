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
  
  avatar: function() {
    return Meteor.user().services.twitter.profile_image_url_https;
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
  
  'change [name=tweeting]': function(event) {
    Session.set(TWEETING_KEY, $(event.target).is(':checked'));
  },
  
  'submit': function(event, template) {
    event.preventDefault();
    
    var text = $(event.target).find('[name=text]').val();

    var tweet = Session.get(TWEETING_KEY) ? 
      $(event.target).find('[name=tweet]').val() : null;

    Meteor.call('createActivity', {
      recipeId: this._id,
      text: text,
      image: Session.get(IMAGE_KEY)
    }, tweet, Geolocation.currentLocation(), function(error) {
      if (! error)
        Template.appBody.addNotification('You shared something.');
      else
        Template.appBody.addNotification('Something went wrong when sharing :(');
    });

    Overlay.close();
  }
});