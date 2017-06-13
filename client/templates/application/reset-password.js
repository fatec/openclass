Template.resetPassword.events({
    
    'submit form': function(e) {

        e.preventDefault();
        var password = e.target.password.value;
        console.log(Accounts._resetPasswordToken);

        Accounts.resetPassword(Accounts._resetPasswordToken, password,function(){
            alert("Le mot de passe a été changé.");
            Router.go('blogList');
        });
    },
    'click .reset-password--button-submit': function(e) {
        e.preventDefault();
        $('#login--form').submit();
    }
});