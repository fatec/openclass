Template.resetPassword.events({
    'submit form': function(e) {

        e.preventDefault();

        var password = e.target.password.value;
        console.log(password);

         Accounts.resetPassword(this.token, password);
       
    },
    'click .reset-password--button-submit': function(e) {
        e.preventDefault();
        $('#login--form').submit();
    }
});