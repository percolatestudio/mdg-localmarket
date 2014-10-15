Recipes = new Meteor.Collection('recipes');

// XXX: is this the most bookmarked?
Recipes.featured = function() {
  return Recipes.find({}, {sort: {bookmarkCount: -1}, limit: 4});
}

Recipes.allow({update: function(userId, doc, fieldNames) {
  return fieldNames.length === 1 && fieldNames[0] === 'bookmarkCount';
}});

// XXX: not sure what the import plan is but this seems OK
if (Meteor.isServer && Recipes.find().count() === 0) {
  var recipes = EJSON.parse(Assets.getText('recipes-data.json'));
  
  _.each(recipes, function(recipe, idx) {
    _.extend(recipe, {rank: idx, bookmarkCount: 0});

    Recipes.insert(recipe);
  });
}