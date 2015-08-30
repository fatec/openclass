Template.register.events({
    'submit .register-form': function (event) {
 
        event.preventDefault();
 
        var username = event.target.username.value;
        var password = event.target.password.value;
  
        Accounts.createUser({username:username,password:password},function(err){
            if(!err) {
                history.back();  
            }
            else {
                console.log(err);
            }
        });
    },
    'click .register-button-cancel': function(e) {
        e.preventDefault();
        history.back();  
    }
});