Recipes = new Meteor.Collection('recipes');

// XXX: is this the most bookmarked?
Recipes.featured = function() {
  return Recipes.find({featured: true}, {sort: {rank: 1}, limit: 4});
}

// XXX: use bookmarks collection
Recipes.bookmarked = function(userId) {
  return Recipes.find({favorite: true});
}

// XXX: how does this work?
// you can only change the favorite field
// Recipes.allow({update: function(userId, doc, fieldNames) {
//   return fieldNames.length === 1 && fieldNames[0] === 'favorite';
// }});

// XXX: not sure what the import plan is but this seems OK
if (Meteor.isServer && Recipes.find().count() === 0) {
  var recipes = EJSON.parse(Assets.getText('recipes-data.json'));
  
  _.each(recipes, function(recipe, idx) {
    _.extend(recipe, {rank: idx});

    Recipes.insert(recipe);
  });
}