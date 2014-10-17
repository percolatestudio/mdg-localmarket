Meteor.publish('allRecipes', function() {
  return Recipes.find();
});

Meteor.publish('news', function() {
  return News.find({}, {sort: {date: -1}, limit: 1});
});

Meteor.publish('feed', function() {
  return Activities.find({}, {sort: {date: -1}, limit: 10});
});

Meteor.publish('featuredRecipes', function() {
  return Recipes.featured();
});

Meteor.publish('bookmarkedRecipes', function() {
  check(this.userId, String);
  return Recipes.bookmarked(Meteor.users.findOne(this.userId));
});

Meteor.publish('recipe', function(id) {
  check(id, String);
  return [
    Recipes.find(id),
    Activities.find({recipeId: id})
  ];
});

// XXX: ?
// autopublish the user's bookmarks
Meteor.publish(null, function() {
  return Meteor.users.find(this.userId, {
    fields: {
      bookmarkedRecipeIds: 1,
      'services.twitter.profile_image_url_https': 1
    }
  });
})