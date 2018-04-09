IndexTeacherController = RouteController.extend({

	waitOn: function() {
		Meteor.subscribe('ownBlogs', Meteor.userId())
	},
	
	action: function () {
		this.render('teacherHeader', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});