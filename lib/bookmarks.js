BookmarkCounts = new Meteor.Collection('bookmarkCounts');

Meteor.methods({
  'bookmarkRecipe': function(recipeName) {
    check(this.userId, String);
    check(recipeName, String);

    var affected = Meteor.users.update({
      _id: this.userId,
      bookmarkedRecipeNames: {$ne: recipeName}
    }, {
      $addToSet: {bookmarkedRecipeNames: recipeName}
    });

    if (affected)
      BookmarkCounts.update({recipeName: recipeName}, {$inc: {count: 1}});
  },

  'unbookmarkRecipe': function(recipeName) {
    check(this.userId, String);
    check(recipeName, String);

    var affected = Meteor.users.update({
      _id: this.userId,
      bookmarkedRecipeNames: recipeName
    }, {
      $pull: {bookmarkedRecipeNames: recipeName}
    });

    if (affected)
      BookmarkCounts.update({recipeName: recipeName}, {$inc: {count: -1}});
  }
});


if (Meteor.isServer && BookmarkCounts.find().count() === 0) {
  Meteor.startup(function() {
    _.each(RecipesData, function(recipe, recipeName) {
      BookmarkCounts.insert({recipeName: recipeName, count: 0});

      // XXX: temp -- insert some fake activities -- remove this!
      Activities.insert({
        recipeName: recipeName,
        text: 'What a great meal, really hit the spot',
        image: 'https://farm1.staticflickr.com/3/3646688_973fa5fd89_o.jpg',
        userAvatar: 'https://avatars0.githubusercontent.com/u/263385?v=2&s=40',
        userName: 'Dominic Nguyen',
        city: 'Paris',
        date: new Date
      })

      Activities.insert({
        recipeName: recipeName,
        text: 'I made this one myself!',
        image: 'https://farm5.staticflickr.com/4154/5190055728_616750bcf0_z.jpg',
        userAvatar: 'https://avatars2.githubusercontent.com/u/132554?v=2&s=40',
        userName: 'Tom Coleman',
        city: 'London',
        date: new Date
      });
    });
  });
}