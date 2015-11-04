LoginController = RouteController.extend({

  	action: function () {
    this.render('loginHeader', {to: 'layout--header'});
    this.render('login', {to: 'layout--main'});
	}
});