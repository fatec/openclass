AdminController = RouteController.extend({

	waitOn: function () {
		return [
				Meteor.subscribe('allBlogs'),
				Meteor.subscribe('allUsers')
			];
	},

	action: function () {
		this.render('header', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});