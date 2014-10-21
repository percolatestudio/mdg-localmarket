var FEATURED_COUNT = 4;

Template.home.helpers({
  // selects FEATURED_COUNT number of recipes at random
  featuredRecipes: function() {
    var recipes = _.values(RecipesData);
    var selection = [];
    
    for (var i = 0;i < FEATURED_COUNT;i++)
      selection.push(recipes.splice(_.random(recipes.length - 1), 1)[0]);

    return selection;
  },
  
  activities: function() {
    return Activities.recent();
  },
  
  latestNews: function() {
    var news = News.findOne({}, {sort: {date: -1}, limit: 1});
    return news && news.text;
  }
});