Template.resetPassword.events({
    'submit form': function(e) {

        e.preventDefault();

        var password = e.target.password.value;
        console.log(this.token);

         Accounts.resetPassword(this.token, password,function(err){console.log(error.message)});
       
    },
    'click .reset-password--button-submit': function(e) {
        e.preventDefault();
        $('#login--form').submit();
    }
});