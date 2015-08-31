Template.blogsList.helpers({
	blogs: function() {
		return Blogs.find();
	}
});