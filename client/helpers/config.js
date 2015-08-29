Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Template.registerHelper('actualLoadedTemplate', function(){
    return Router.current() && Router.current().route.getName().replace('.','-');
  }
);

// Remove original login fileds and set new ones
AccountsTemplates.removeField('email');
AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
	displayName: "Nom d'utilisateur",
	placeholder: "Nom d'utilisateur",
    required: true,
});

AccountsTemplates.removeField('password');
AccountsTemplates.addField({
    _id: 'password',
    type: 'password',
	displayName: "Mot de passe",
	placeholder: "Mot de passe",
    required: true,
});

// Set useraccounts localization with mrt:accounts-t9n
T9n.setLanguage("fr");
