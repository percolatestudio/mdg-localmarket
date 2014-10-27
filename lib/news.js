News = new Mongo.Collection('news');

if (Meteor.isServer && News.find().count() === 0) {
  Meteor.startup(function() {
    News.insert({
      text: 'First of the season citrus has just arrived. Get succulent oranges and tangerines in our produce aisle!',
      date: new Date
    });
  });
}