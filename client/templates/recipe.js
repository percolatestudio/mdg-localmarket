Template.recipe.events({
  'click [data-ingredients-trigger]': function(e, template) {
    // XXX: @zol -- we should split velocity out as a separate package and
    //   explicitly depend on it
    template.$('[data-ingredients]').velocity('scroll', {
      container: $('#content-container')
    });
  }
});