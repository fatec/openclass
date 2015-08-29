/**
  * Accounts-ui ugly translation
  * TODO : use i18n solution
  */
   Template.blogsHeader.rendered = function() {
     $('#login-sign-in-link').text('Connexion ▾');
     $('.login-close-text').text('Fermer');
     $('#login-username-or-email-label').text('Pseudo ou email');
     $('#login-password-label').text('Mot de passe (mdp)');
     $('#signup-link').text('Créer un compte');
     $('#forgot-password-link').text('Mdp oublié');
     $('#login-buttons-forgot-password').text('Récupération');
     $('#back-to-login-link').text('Connexion');
     $('#login-username-label').text('Pseudo');
     $('#login-buttons-open-change-password').text('Changer de mdp');
     $('#login-buttons-logout').text('Deconnexion');
     if ($('#login-buttons-password').text().indexOf('Sign in') != -1) {
       $('#login-buttons-password').text('Connexion');
     } else {
       $('#login-buttons-password').text('Créer le compte');
     }
     $('.login-button').addClass('btn btn-warning');
     $('.login-button').removeClass('login-button login-button-form-submit');
     if ($('.message.error-message').text().indexOf('Username must be at least 3 characters long') != -1) {
       $('.message.error-message').text('Le login doit faire plus de 3 caractères');
     } else if ($('.message.error-message').text().indexOf('Incorrect password') != -1 || $('.message.error-message').text().indexOf('User not found') != -1) {
       $('.message.error-message').text('login ou mot de passe incorrect');
     }
     $('#login-old-password-label').text('Mot de passe actuel');
     $('#login-buttons-do-change-password').text('Changer le mot de passe');
     $('#reset-password-new-password-label').text('Nouveau mot de passe');
     $('#login-buttons-reset-password-button').text('Changer');
     if ($('.message.info-message').text().indexOf('Email sent') != -1) $('.message.info-message').text('Email envoyé');
     $('#just-verified-dismiss-button').parent().html('Email vérifié <div class="btn btn-warning" id="just-verified-dismiss-button">Masquer</div>');
     }