Template.login.events({
    'submit form': function(e) {

        e.preventDefault();

        var username = e.target.username.value;
        var password = e.target.password.value;
        
        Meteor.loginWithPassword(username.toLowerCase(),password,function(err){
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
    },    
    'click .login--button-cancel': function(e) {
        e.preventDefault();
        Router.go('blogsList');
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