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
  var recipes = EJSON.parse(Assets.getText('recipes-data.json'));
  
  _.each(recipes, function(recipe, idx) {
    _.extend(recipe, {rank: idx, bookmarkCount: 0});

    Recipes.insert(recipe);
  });
}