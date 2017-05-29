BlogListController = RouteController.extend({

	waitOn: function() {
		Meteor.subscribe('blogs', Meteor.userId())
	},
	
	action: function () {
		this.render();
	},
	fastRender: true
});