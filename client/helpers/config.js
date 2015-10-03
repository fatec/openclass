// Accounts.ui.config({
//   passwordSignupFields: 'USERNAME_ONLY'
// });

Template.registerHelper('actualLoadedTemplate', function(){
    return Router.current() && Router.current().route.getName().replace('.','-');
  }
);

/*
  if (typeof Games !== 'undefined' && Games != null)
    var game = Games.findOne({_id: this._id});
    if (game != null && game.mode)
      return 'Difficult';
  return 'Easy';
 */