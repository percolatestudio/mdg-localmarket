Recipes = new Meteor.Collection('recipes');
Recipes.SEASONS = ['Summer', 'Fall', 'Winter', 'Spring'];


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