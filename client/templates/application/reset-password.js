Template.resetPassword.events({
    'submit form': function(e) {

        e.preventDefault();

        var password = e.target.password.value;

         Accounts.resetPassword(this.token, password);
       
    },
    'click .login--button-submit': function(e) {
        e.preventDefault();
        $('#login--form').submit();
    }
});