Template.login.events({
    'submit form': function(e) {

        e.preventDefault();

         var email = e.target.email.value;
       

        //var username = e.target.username.value;
        var password = e.target.password.value;
        
        // Meteor.loginWithPassword(username.toLowerCase().trim(),password,function(err){
        Meteor.loginWithPassword(email.toLowerCase(),password,function(err){
            if(!err) {
                Router.go('blogsList');
            }
            else
            {      
                Session.set('errorMessage', err.message);
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
  this.$('.login--input-username').focus() 
}