LogoutController = RouteController.extend({

  	action: function () {
    //this.render('logoutHeader', {to: 'layout--header'});
    //this.render('logout', {to: 'layout--main'});
        this.render();

	},
	  fastRender: true
});