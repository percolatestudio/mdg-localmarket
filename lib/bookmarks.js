Bookmarks = new Mongo.Collection('bookmarks');

Bookmarks.allow({
  insert: function(userId, doc) {
    return userId && doc.userId === userId;
  },
  remove: function(userId, doc) {
    return userId && doc.userId === userId;
  }
});

Bookmarks.forUser = function(userId) {
  return Bookmarks.find({userId: userId});
}