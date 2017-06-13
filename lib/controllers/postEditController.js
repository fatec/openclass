PostEditController = RouteController.extend({

	waitOn: function () {
		blogId = Posts.findOne(this.params._id).blogId;

		return [
	  		Meteor.subscribe('post', this.params._id),
	  		Meteor.subscribe('tags', blogId),
	  		Meteor.subscribe('categories', blogId),
	  		Meteor.subscribe('blog', this.params._id),
		]; 
  	},

  	data: function () {
		return {
	  		post: Posts.findOne(this.params._id),
	  		blog: Blogs.findOne(blogId)
		}
 	},

  	action: function () {
  		this.render('postEditHeader', {to: 'layout--header'});
		this.render();
  	},

	fastRender: true
});