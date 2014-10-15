Meteor.publish('allRecipes', function() {
  return Recipes.find();
});

Meteor.publish('feed', function() {
  return Activities.find({}, {sort: {date: -1}, limit: 10});
});

Meteor.publish('featuredRecipes', function() {
  return Recipes.featured();
});

Meteor.publish('bookmarks', function() {
  check(this.userId, String)
  return Bookmarks.forUser(this.userId);
});

// XXX: client side join. Better way?
Meteor.publish('recipesById', function(ids) {
  check(ids, [String]);
  return Recipes.find({_id: {$in: ids}});
});

Meteor.publish('recipe', function(id) {
  check(id, String);
  return [
    Recipes.find(id),
    Activities.find({recipeId: id}),
    Bookmarks.find({recipeId: id, userId: this.userId})
  ];
});