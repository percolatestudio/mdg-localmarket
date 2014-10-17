News = new Mongo.Collection('news');

if (Meteor.isServer && News.find().count() === 0) {
  Meteor.startup(function() {
    News.insert({
      text: 'Duck breasts just arrived at the deli!',
      date: new Date
    });
  });
}