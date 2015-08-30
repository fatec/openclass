Template.postsMenu.helpers({
	postCount: function() { // return the number of posts
		return Posts.find().count();  }
});