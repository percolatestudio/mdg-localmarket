var requestWrappedAsync = Meteor.wrapAsync(Npm.require('request'));

TwitterRequest = {
  call: function(options) {
    var config = Meteor.settings.twitter
    var userConfig = Meteor.user().services.twitter;
  
    options.oauth = {
      consumer_key: config.consumerKey, 
      consumer_secret: config.secret,
      token: userConfig.accessToken,
      token_secret: userConfig.accessTokenSecret
    };
  
    return requestWrappedAsync(options);
  }
}
