Recipes = new Meteor.Collection('recipes');

Recipes.SEASONS = {
  spring: {
    name: 'spring',
    title: 'Spring Bites',
    description: 'Refreshing recipes that capture the vibrancy of springtime'
  }, 
  summer: {
    name: 'summer',
    title: 'Summer Tastes',
    description: 'Perfectly ripe seasonal dishes that feature the wealth of summer produce'
  }, 
  fall: {
    name: 'fall',
    title: 'Fall Flavors',
    description: 'Rich flavorful recipes perfect for those brisk autumnal days'
  }, 
  winter: {
    name: 'winter',
    title: 'Winter Dishes',
    description: 'Hearty dishes to spread warmth to you and your family this winter season'
  }
}

Recipes.ValidSeason = Match.Where(function (x) {
  check(x, String);
  return _.include(_.keys(Recipes.SEASONS), x);
});

Recipes.featured = function() {
  return Recipes.find({featured: true}, {sort: {rank: 1}});
}

Recipes.favorite = function() {
  return Recipes.find({favorite: true});
}

Recipes.forSeason = function(name) {
  check(name, Recipes.ValidSeason);
  return Recipes.find({season: name}, {sort: {rank: 1}});
}

// you can only change the favorite field
Recipes.allow({update: function(userId, doc, fieldNames) {
  return fieldNames.length === 1 && fieldNames[0] === 'favorite';
}});

// XXX: not sure what the import plan is but this seems OK
if (Meteor.isServer && Recipes.find().count() === 0) {
  var recipes = EJSON.parse(Assets.getText('recipes.json'));
  
  _.each(recipes, function(recipe, idx) {
    check(recipe.season, Recipes.ValidSeason);

    _.extend(recipe, {rank: idx});

    Recipes.insert(recipe);
  });
}