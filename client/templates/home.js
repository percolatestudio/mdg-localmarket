Template.home.helpers({
  featuredRecipes: function() {
    return _.values(RecipesData).slice(0, 4);
  },
  
  activities: function() {
    return Activities.recent();
  },
  
  latestNews: function() {
    var news = News.findOne({}, {sort: {date: -1}, limit: 1});
    return news && news.text;
  }
});