BlogListController = RouteController.extend({

	waitOn: function() {
		Meteor.subscribe('ownBlogs', Meteor.userId())
	},
	
	action: function () {
		this.render('blogsHeader', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});