Momentum.registerPlugin('fade', function(options) {
  options = _.extend({}, options, {
    duration: 500,
  });
  
  return {
    insertElement: function(node, next, done) {
      var $node = $(node);
      
      $node
        .insertBefore(next)
        .velocity('fadeIn', {
          duration: options.duration,
          complete: done
        });
    },
    removeElement: function(node, done) {
      var $node = $(node);

      $node
        .velocity("fadeOut", {
          duration: options.duration,
          complete: function() {
            $node.remove();
            done();
          }
        });
    }
  }
});

