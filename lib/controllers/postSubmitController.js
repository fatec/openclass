PostSubmitController = RouteController.extend({

	onBeforeAction: function () {
		if (!Session.get(this.params._id))  {
			// If the user has not a blogId session, render the blogUsers template
			this.render('blogEditHeader', {to: 'layout--header'});
			this.render('blogUsers', {to: 'layout--main'});
		} else {
			this.next();
		}
	},

	waitOn: function () {
		return [
			Meteor.subscribe('tags', this.params._id),
			Meteor.subscribe('authors', this.params._id),
			Meteor.subscribe('categories', this.params._id),
			Meteor.subscribe('blog', this.params._id),
		];
	},

	data: function () {    
		return {
			blog: Blogs.findOne(this.params._id)
		}
	},

	action: function () {
		this.render('postSubmitHeader', {to: 'layout--header'});
		this.render();
	},
	
	fastRender: true
});