Meteor.methods({
  'emailRecipes': function(recipeIds, options) {
    check(recipeIds, [String]);
    check(options, {
      name: String,
      sender: String, // XXX: can check for email?
      recipient: String 
    });
    
    var text = "Hi " + options.name + ",\n" +
      "You've had some recipes shared with you.\n" + 
      "Here they come!\n\n";
    
    Recipes.find({_id: {$in: recipeIds}}).forEach(function(recipe) {
      text += " - " + recipe.title + ": " + Router.url('recipe', recipe) + "\n";
    });
    
    Email.send({
      from: options.sender,
      to: options.recipient,
      subject: "Sous Recipes",
      text: text
    });
  }
});