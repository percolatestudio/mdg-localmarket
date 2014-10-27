Template.feed.helpers({
  activities: function() {
    return Activities.find({}, {sort: {date: -1}});
  },
  ready: function() {
    return true;
    // xcxc:
    return feedSubscription && feedSubscription.ready();
  }
})
