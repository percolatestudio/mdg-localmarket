var request = Npm.require('request');
var postSync = Meteor.wrapAsync(request.post);

makeOauthRequest = function (options) {
  var config = Meteor.settings.twitter
  var userConfig = Meteor.user().services.twitter;
  
  options.oauth = {
    consumer_key: config.consumerKey, 
    consumer_secret: config.secret,
    token: userConfig.accessToken,
    token_secret: userConfig.accessTokenSecret
  };
  
  return postSync(options);
}
