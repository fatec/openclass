Template.login.events({
    'submit form': function(e) {

        e.preventDefault();

         var email = e.target.email.value;
       

        //var username = e.target.username.value;
        var password = e.target.password.value;

        Session.set('errorMessage', '');

        
        // Meteor.loginWithPassword(username.toLowerCase().trim(),password,function(err){
        Meteor.loginWithPassword(email.toLowerCase(),password,function(err){
            if(!err) {
                Router.go('blogsList');
            }
            else
            {      
                Session.set('errorMessage', err.reason);
            }
        });
    },
    'click .login--button-submit': function(e) {
        e.preventDefault();
        $('#login--form').submit();
    }
});

Template.login.helpers({
  errorMessage: function() {
    return Session.get('errorMessage');
  }
});

Template.login.rendered = function(){
    
    Session.set('errorMessage', '');

  this.$('.login--input-username').focus();
  if (Meteor.isClient) {
    T9n.map('fr', {
        'User not found': 'L\'utilisateur n\'existe pas.',
        'Incorrect password': 'Le mot de passe n\'est pas correct.'
        });
    }
}