Template.postEditHeader.events({
    'click .post-edit--button-submit': function(e) {
    e.preventDefault();
    $('#post-edit--form').submit();
  }
});
Template.postEditHeader.helpers({
	blog: function() {
		var currentPostId = this.post._id;
		var currentPost = Posts.findOne(currentPostId);
		var blogId = Blogs.findOne(currentPost.blogId);
		return blogId
	}
});