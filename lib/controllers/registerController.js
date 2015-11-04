RegisterController = RouteController.extend({

  	action: function () {
    	this.render('registerHeader', {to: 'layout--header'});
    	this.render('register', {to: 'layout--main'});
	}
});