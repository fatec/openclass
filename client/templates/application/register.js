Template.register.events({
    'submit form': function (event) {
 
        event.preventDefault();
 
        var email = event.target.email.value;
        //var username = event.target.username.value;
        var password = event.target.password.value;
  
        Accounts.createUser({email:email.toLowerCase().trim(),password:password},function(err){
            if(!err) {
                Router.go('blogsList');
            }
            else {
                Session.set('errorMessage', err.reason);
                console.log(err.reason);
            }
        });
    },
    'click .register--button-submit': function(e) {
        e.preventDefault();
        $('#register--form').submit();
    }
});

Template.register.helpers({
  errorMessage: function() {
    return Session.get('errorMessage');
  },
  isBox: function() {
    if (Meteor.settings.public.isBox === "true")
        return true;
    else
        return false;
  }
});

Template.register.rendered = function(){
    this.$('.register--input-username').focus();

    Session.set('errorMessage', '');

    if (Meteor.isClient) {
        T9n.map('fr', {
            'Email already exists.': 'Un compte lié à cet e-mail existe déjà.'
        });
    }

    $.validator.messages.email = "Merci d'entrer une adresse e-mail valide.";
         $(".register--form").validate();
}