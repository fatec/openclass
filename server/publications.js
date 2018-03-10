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

Meteor.publish("file", function(fileId) {
	return Files.find({fileId:fileId})
});

Meteor.publish("files", function(blogId) {
	return Files.find({blogId: blogId})
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


Meteor.publish("count-all-pinned", function (blogId) {
	var self = this;
	var pinnedCounts = 0;
	var initializing = true;

	var handle = Posts.find({blogId: blogId, pinned:true}).observeChanges({
		added: function (doc, idx) {
			pinnedCounts++;
			if (!initializing) {
				self.changed("pinnedCounts", blogId, {count: pinnedCounts});  // "counts" is the published collection name
			}
		},
		removed: function (doc, idx) {
			pinnedCounts--;
			self.changed("pinnedCounts", blogId, {count: pinnedCounts});  // Same published collection, "counts"
		}
	});

	initializing = false;

	// publish the initial count. `observeChanges` guaranteed not to return
	// until the initial set of `added` callbacks have run, so the `count`
	// variable is up to date.
	self.added("pinnedCounts", blogId, {count: pinnedCounts});

	// and signal that the initial document set is now available on the client
	self.ready();

	// turn off observe when client unsubscribes
	self.onStop(function () {
		handle.stop();
	});
});


Meteor.publish("count-all-files", function (blogId) {
	var self = this;
	var filesCounts = 0;
	var initializing = true;

	//var handle = Posts.find({blogId: blogId, $or : [{fileExt:"txt"},{fileExt:"rtf"},{fileExt:"pdf"},{fileExt:"zip"}]}).observeChanges({

	var handle = Posts.find({blogId: blogId, $and : [{fileId:{$exists:true} },{fileId:{$ne:false} },{fileExt:{$nin : ["jpg","jpeg","png","gif"]}}]}).observeChanges({
		added: function (doc, idx) {
			filesCounts++;
			if (!initializing) {
				self.changed("filesCounts", blogId, {count: filesCounts});  // "counts" is the published collection name
			}
		},
		removed: function (doc, idx) {
			filesCounts--;
			self.changed("filesCounts", blogId, {count: filesCounts});  // Same published collection, "counts"
		}
	});

	initializing = false;

	// publish the initial count. `observeChanges` guaranteed not to return
	// until the initial set of `added` callbacks have run, so the `count`
	// variable is up to date.
	self.added("filesCounts", blogId, {count: filesCounts});

	// and signal that the initial document set is now available on the client
	self.ready();

	// turn off observe when client unsubscribes
	self.onStop(function () {
		handle.stop();
	});
});


Meteor.publish("count-all-images", function (blogId) {
	var self = this;
	var imagesCounts = 0;
	var initializing = true;

	var handle = Posts.find({blogId: blogId, $or : [{fileExt:"jpg"},{fileExt:"jpeg"},{fileExt:"gif"},{fileExt:"png"}]}).observeChanges({
		added: function (doc, idx) {
			imagesCounts++;
			if (!initializing) {
				self.changed("imagesCounts", blogId, {count: imagesCounts});  // "counts" is the published collection name
			}
		},
		removed: function (doc, idx) {
			imagesCounts--;
			self.changed("imagesCounts", blogId, {count: imagesCounts});  // Same published collection, "counts"
		}
	});

	initializing = false;

	// publish the initial count. `observeChanges` guaranteed not to return
	// until the initial set of `added` callbacks have run, so the `count`
	// variable is up to date.
	self.added("imagesCounts", blogId, {count: imagesCounts});

	// and signal that the initial document set is now available on the client
	self.ready();

	// turn off observe when client unsubscribes
	self.onStop(function () {
		handle.stop();
	});
});