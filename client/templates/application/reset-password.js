Template.resetPassword.events({
    'submit form': function(e) {

        e.preventDefault();

        var password = e.target.password.value;
        console.log(Accounts._resetPasswordToken);

         Accounts.resetPassword(Accounts._resetPasswordToken, password,function(err){if(err){console.log(error.message)}else{alert("c'est bon")});
       
    },
    'click .reset-password--button-submit': function(e) {
        e.preventDefault();
        $('#login--form').submit();
    }
});