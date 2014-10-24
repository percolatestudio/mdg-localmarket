Template.feed.helpers({
  activities: function() {
    return Activities.find({}, {sort: {date: -1}});
  }
})