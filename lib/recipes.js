Recipes = new Meteor.Collection('recipes');

// XXX: is this the most bookmarked?
Recipes.featured = function() {
  return Recipes.find({}, {sort: {bookmarkCount: -1}, limit: 4});
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
        image: 'https://farm3.staticflickr.com/2759/4385732951_fd0542c2cf_q_d.jpg',
        userAvatar: 'http://static.squarespace.com/static/531173e3e4b05444a30866c4/53118426e4b02a8d250f7351/5311870ae4b01148f94c6753/1393657611367/user-avatar-placeholder.png',
        date: new Date
      })
      
      Activities.insert({
        recipeId: recipe._id,
        text: 'I made this one myself!',
        image: 'https://farm4.staticflickr.com/3061/2596329869_ff7d9d4bf2_q_d.jpg',
        userAvatar: 'http://www.hubertus-schluchsee.de/extension/ezdemo/design/ezdemo/images/user.gif',
        date: new Date
      });
    });
  });
}