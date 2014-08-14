Recipes = new Meteor.Collection('recipes');
Recipes.SEASONS = ['summer', 'fall', 'winter', 'spring'];
Recipes.SEASON_NAMES = {
  summer: 'Summer Tastes',
  fall: 'Fall Flavors',
  winter: 'Winter Dishes',
  spring: 'Spring Bites'
}

Recipes.featured = function() {
  return Recipes.find({featured: true});
}

Recipes.favorite = function() {
  return Recipes.find({favorite: true});
}

Recipes.forSeason = function(name) {
  check(name, Match.Where(function(n) { return _.include(Recipes.SEASONS, n); }));
  return Recipes.find({season: name});
}

// you can only change the favorite field
Recipes.allow({update: function(userId, doc, fieldNames) {
  return fieldNames.length === 1 && fieldNames[0] === 'favorite';
}});

// XXX: not sure what the import plan is but this seems OK
if (Meteor.isServer && Recipes.find().count() === 0) {
  var recipes = EJSON.parse(Assets.getText('recipes.json'));
  
  _.each(recipes, function(recipe) {
    // XXX: should we use a schema? probably not
    if (! _.include(Recipes.SEASONS, recipe.season))
      throw new Meteor.Error("Not a valid season: " + recipe.season);
    
    Recipes.insert(recipe);
  });
}