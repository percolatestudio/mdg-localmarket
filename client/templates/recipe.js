Template.recipe.events({
  'click [data-favorite]': function(e) {
    e.preventDefault();
    
    // XXX: methods?
    Recipes.update(this._id, {$set: {favorite: true}});
  },

  'click [data-unfavorite]': function(e) {
    e.preventDefault();
    
    // XXX: methods?
    Recipes.update(this._id, {$unset: {favorite: true}});
  },
  
  'click [data-ingredients-trigger]': function(e, template) {
    // XXX: @zol -- we should split velocity out as a separate package and
    //   explicitly depend on it
    template.$('[data-ingredients]').velocity('scroll', {
      container: $('#content-container')
    });
  }
});