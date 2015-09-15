Template.register.events({
    'submit form': function (event) {
 
        event.preventDefault();
 
        var username = event.target.username.value;
        var password = event.target.password.value;
  
        Accounts.createUser({username:username.toLowerCase().trim(),password:password},function(err){
            if(!err) {
                Router.go('blogsList');
            }
            else {
                console.log(err);
            }
        });
    },
    'click .register--button-submit': function(e) {
        e.preventDefault();
        $('#register--form').submit();
    }
});

Template.register.rendered = function(){
  this.$('.register--input-username').focus() 
}