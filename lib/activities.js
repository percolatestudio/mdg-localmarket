Activities = new Mongo.Collection('activities');

Activities.allow({
  insert: function(userId, doc) {
    return doc.userId === userId;
  }
});

Activities.recent = function() {
  return Activities.find({}, {sort: {date: -1}, limit: 10});
}
