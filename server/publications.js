Meteor.publish('blog', function(blogId) {
	check(blogId, String);
	return Blogs.find({_id: blogId});	
});

Meteor.publish('allBlogs', function() {
	return Blogs.find({});
});

Meteor.publish('ownBlogs', function(userId) {
	return Blogs.find({userId:userId});
});

Meteor.publish('blogsVisited', function(blogsId) {
	return Blogs.find({ "_id": { "$in": blogsId } });
});

Meteor.publish('post', function(postId) {
	check(postId, String);
	return Posts.find({_id: postId});
});

Meteor.publish('posts', function(filters,skip,limit) {
	return Posts.find(filters, {sort: {submitted: 1},skip:skip,limit:limit});
});

Meteor.publish("image", function(imageId) {
	return Images.find({imageId:imageId})
});

Meteor.publish("images", function(blogId) {
	return Images.find({blogId: blogId});
});

Meteor.publish("authors", function(blogId) {
	return Authors.find({blogId: blogId});
});

Meteor.publish("categories", function(blogId) {
	return Categories.find({blogId: blogId});
});

Meteor.publish("tags", function(blogId) {
	return Tags.find({blogId: blogId});
});

Meteor.publish('allUsers', function() {
	return Meteor.users.find();
 })

// Publish the current size of a collection without subscribe to the collection
Meteor.publish("count-all-posts", function (blogId) {
	var self = this;
	var count = 0;
	var initializing = true;

	var handle = Posts.find({blogId: blogId}).observeChanges({
		added: function (doc, idx) {
			count++;
			if (!initializing) {
				self.changed("counts", blogId, {count: count});  // "counts" is the published collection name
			}
		},
		removed: function (doc, idx) {
			count--;
			self.changed("counts", blogId, {count: count});  // Same published collection, "counts"
		}
	});

	initializing = false;

	// publish the initial count. `observeChanges` guaranteed not to return
	// until the initial set of `added` callbacks have run, so the `count`
	// variable is up to date.
	self.added("counts", blogId, {count: count});

	// and signal that the initial document set is now available on the client
	self.ready();

	// turn off observe when client unsubscribes
	self.onStop(function () {
		handle.stop();
	});
});