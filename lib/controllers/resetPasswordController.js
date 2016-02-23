ResetPasswordController = RouteController.extend({
	 onBeforeAction: function() {
        Accounts._resetPasswordToken = this.params.token;
        this.next();
    },
  data: function () {
    return {
		//token: this.params.token
    }
  },
  	action: function () {
    this.render('loginHeader', {to: 'layout--header'});
    this.render('resetPassword', {to: 'layout--main'});
	}
});