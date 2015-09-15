Template.mobileMenu.helpers({
	postCount: function() { // return the number of posts
		return Posts.find().count();
	},
	tags: function() {
		return Tags.find({}, {sort: {nRefs: -1}});
	}
});