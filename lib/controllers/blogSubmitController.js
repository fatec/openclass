BlogSubmitController = RouteController.extend({

	waitOn: function () {
		Meteor.subscribe('codes');
    },

	action: function () {
		//this.render('header', {to: 'layout--header'});
		//this.render('blogSubmit', {to: 'layout--main'});
		this.render();

	},
	  fastRender: true
});