Recipes = new Meteor.Collection('recipes');

// XXX: is this the most bookmarked?
Recipes.featured = function() {
  return Recipes.find({}, {sort: {bookmarkCount: -1}, limit: 4});
}

Recipes.all = function() {
  return Recipes.find({}, {sort: {rank: 1}});
}

Recipes.bookmarked = function(user) {
  return Recipes.find({_id: {$in: user.bookmarkedRecipeIds || []}});
}

Meteor.methods({
  'bookmarkRecipe': function(recipeId) {
    check(this.userId, String);
    check(recipeId, String);

    var affected = Meteor.users.update({
      _id: this.userId,
      bookmarkedRecipeIds: {$ne: recipeId}
    }, {
      $addToSet: {bookmarkedRecipeIds: recipeId}
    });

    if (affected)
      Recipes.update(recipeId, {$inc: {bookmarkCount: 1}});
  },

  'unbookmarkRecipe': function(recipeId) {
    check(this.userId, String);
    check(recipeId, String);

    var affected = Meteor.users.update({
      _id: this.userId,
      bookmarkedRecipeIds: recipeId
    }, {
      $pull: {bookmarkedRecipeIds: recipeId}
    });

    if (affected)
      Recipes.update(recipeId, {$inc: {bookmarkCount: -1}});
  }
});


// XXX: not sure what the import plan is but this seems OK
if (Meteor.isServer && Recipes.find().count() === 0) {
  Meteor.startup(function() {
    var recipes = EJSON.parse(Assets.getText('recipes-data.json'));

    _.each(recipes, function(recipe, idx) {
      _.extend(recipe, {rank: idx, bookmarkCount: 0});

      recipe._id = Recipes.insert(recipe);

      // XXX: temp -- insert some fake activities -- remove this!
      Activities.insert({
        recipeId: recipe._id,
        text: 'What a great meal, really hit the spot',
        image: 'https://farm1.staticflickr.com/3/3646688_973fa5fd89_o.jpg',
        userAvatar: 'https://avatars0.githubusercontent.com/u/263385?v=2&s=40',
        userName: 'Dominic Nguyen',
        date: new Date
      })

      Activities.insert({
        recipeId: recipe._id,
        text: 'I made this one myself!',
        image: 'https://farm5.staticflickr.com/4154/5190055728_616750bcf0_z.jpg',
        userAvatar: 'https://avatars2.githubusercontent.com/u/132554?v=2&s=40',
        userName: 'Zoltan Olah',
        date: new Date
      });
    });
  });
}