Template.resetPassword.events({
    'submit form': function(e) {

        e.preventDefault();

        var password = e.target.password.value;
        console.log(this);

         Accounts.resetPassword(this.token.toString(), password,function(err){console.log(error.message)});
       
    },
    'click .reset-password--button-submit': function(e) {
        e.preventDefault();
        $('#login--form').submit();
    }
});