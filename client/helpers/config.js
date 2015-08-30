// Accounts.ui.config({
//   passwordSignupFields: 'USERNAME_ONLY'
// });

Template.registerHelper('actualLoadedTemplate', function(){
    return Router.current() && Router.current().route.getName().replace('.','-');
  }
);