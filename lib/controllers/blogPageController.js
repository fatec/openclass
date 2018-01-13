BlogPageController = RouteController.extend({

	onBeforeAction: function () {
		if (!Session.get(this.params._id)) {
			Router.go('blogUsers', {_id: this.params._id});
		}
		
		this.next();
	},

	waitOn: function () { 
		return [
			Meteor.subscribe('images', this.params._id),
			Meteor.subscribe("count-all-posts", this.params._id),
			Meteor.subscribe("count-all-pinned", this.params._id),
			Meteor.subscribe('blog', this.params._id),
			Meteor.subscribe('tags', this.params._id),
			Meteor.subscribe('authors', this.params._id),
			Meteor.subscribe('categories', this.params._id)  
		];
	},

	data: function () {
		return {
			blog: Blogs.findOne(this.params._id),
			posts: Posts.find({blogId:this.params._id})
		}
	},

	action: function () {
		this.render('slideoutMenu', {to: 'layout--menu'});
		this.render('postsHeader', {to: 'layout--header'});
		this.render();
	},

	fastRender: true
});