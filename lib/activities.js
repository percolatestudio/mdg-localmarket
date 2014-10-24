Activities = new Mongo.Collection('activities');

Activities.allow({
  insert: function(userId, doc) {
    return doc.userId === userId;
  }
});

Activities.latest = function() {
  return Activities.find({}, {sort: {date: -1}, limit: 1});
}

Meteor.methods({
  createActivity: function(activity, tweet, loc) {
    check(Meteor.userId(), String);
    check(activity, {
      recipeName: String,
      text: String,
      image: String
    });
    check(tweet, Boolean);
    check(loc, Match.OneOf(Object, null));
    
    activity.userId = Meteor.userId();
    activity.userAvatar = Meteor.user().services.twitter.profile_image_url_https;
    activity.userName = Meteor.user().profile.name;
    activity.date = new Date;
    
    if (! this.isSimulation && loc)
      activity.city = getLocationCity(loc);
    
    var id = Activities.insert(activity);
    
    if (! this.isSimulation && tweet)
      tweetActivity(activity);
    
    return id;
  }
});

if (Meteor.isServer) {
  var tweetActivity = function(activity) {
    // we need to strip the "data:image/jpeg;base64," bit off the data url
    var image = activity.image.replace(/^data.*base64,/, '');

    var response = TwitterRequest.call({
      method: 'post',
      url: 'https://upload.twitter.com/1.1/media/upload.json',
      form: { media: image }
    });
    
    if (response.statusCode !== 200)
      throw new Meteor.Error(500, 'Unable to post image to twitter.');

    var attachment = JSON.parse(response.body);
    
    TwitterRequest.call({
      method: 'post',
      url: 'https://api.twitter.com/1.1/statuses/update.json',
      form: {
        status: activity.text + ' #localmarket',
        media_ids: attachment.media_id_string
      }
    });
  }
  
  var getLocationCity = function(loc) {
    var url = 'https://api.twitter.com/1.1/geo/reverse_geocode.json'
      + '?granularity=city'
      + '&max_results=1'
      + '&accuracy=' + loc.coords.accuracy
      + '&lat=' + loc.coords.latitude
      + '&long=' + loc.coords.longitude;
    
    var response = TwitterRequest.call({ method: 'post', url: url });

    if (response.statusCode === 200) {
      var data = JSON.parse(response.body);
      return data.result.places[0].full_name; // or just 'name'
    }
  }
}
