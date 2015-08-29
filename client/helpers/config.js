Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Template.registerHelper('actualLoadedTemplate', function(){
    return Router.current() && Router.current().route.getName().replace('.','-');
  }
);

// Change semantic-ui localization with mrt:accounts-t9n 
T9n.setLanguage("fr");
dans helpers -> config.js