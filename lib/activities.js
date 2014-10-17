Activities = new Mongo.Collection('activities');

Activities.allow({
  insert: function(userId, doc) {
    return doc.userId === userId;
  }
});

Activities.recent = function() {
  return Activities.find({}, {sort: {date: -1}, limit: 10});
}

Meteor.methods({
  createActivity: function(activity, tweet) {
    check(Meteor.userId(), String);
    check(activity, {
      recipeId: String,
      text: String,
      image: String
    });
    check(tweet, Match.Optional(String));
    
    activity.userId = Meteor.userId();
    activity.userAvatar = Meteor.user().services.twitter.profile_image_url_https;
    activity.userName = Meteor.user().profile.name;
    activity.date = new Date;
    
    Activities.insert(activity);
    
    if (! this.isSimulation && tweet)
      tweetActivity(tweet);
  }
});

if (Meteor.isServer) {
  var tweetActivity = function(tweet) {
    var config = Meteor.settings.twitter
    var userConfig = Meteor.user().services.twitter;
    var binding = new OAuth1Binding(config);
    binding.accessToken = userConfig.accessToken;
    binding.accessTokenSecret = userConfig.accessTokenSecret;
  
    var url = 'https://api.twitter.com/1.1/statuses/update.json';
  
    return binding.post(url, {status: tweet});
  }
}
