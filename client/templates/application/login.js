Template.login.onRendered(function () {
	
	Session.set('errorMessage', ''); // hide error messages

	this.$('.login--input-username').focus();

	T9n.map('fr', {
		'User not found': 'L\'utilisateur n\'existe pas.',
		'Incorrect password': 'Le mot de passe n\'est pas correct.'
	});
});


Template.login.helpers({

	errorMessage: function() {
		return Session.get('errorMessage');
	},
	passwordRecovery: function() {
		if (Session.get('errorMessage') === 'Incorrect password')
			return true;
	}
});


Template.login.events({
	
	'submit form': function(e) {

		e.preventDefault();

		Session.set('errorMessage', ''); // hide error messages

		var email = e.target.email.value;
		var password = e.target.password.value;

		Meteor.loginWithPassword(email.trim(),password,function(err) {
			if(!err)
				Router.go('blogsList');
			else    
				Session.set('errorMessage', err.reason);
		});
	},
	'click .login--button-submit': function(e) {
		e.preventDefault();
		$('#login--form').submit();
	},
	'click .send-mail-forgot-password': function(e) {
		e.preventDefault();

		var email = $('#email').val();
		Accounts.forgotPassword({email:email},function(err) {
			if(!err)
				alert("Un e-mail a été envoyé à l'adresse "+email+" comprenant un lien pour réinitialiser votre mot de passe.")    
			else {
				alert("Une erreur est survenue. Merci de contacter l'administrateur à l'adresse : vincent.widmer@beekee.ch");
				console.log("Erreur lors de l'envoi d'un e-mail pour récupérer un mot de passe : "+err);
			}
		});
	}
});