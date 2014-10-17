Template.home.helpers({
  featuredRecipes: function() {
    return Recipes.featured();
  },
  
  activities: function() {
    return Activities.recent();
  },
  
  latestNews: function() {
    var news = News.findOne({}, {sort: {date: -1}, limit: 1});
    return news && news.text;
  }
});