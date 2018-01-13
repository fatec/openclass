Posts = new Mongo.Collection('posts');

// TODO : add server-side security

Posts.allow({
	insert: function() {return true;},

	remove: function() {return true;},

	update: function() {return true;}
});

if(Meteor.isClient) {
	Counts = new Mongo.Collection("counts"); // Store post count of a blog ; Allow to count them without subscribe to all posts (optimization)
	PinnedCounts = new Mongo.Collection("pinnedCounts"); // Store post count of a blog ; Allow to count them without subscribe to all posts (optimization)
}

if(Meteor.isServer) {

	Posts.before.insert(function (userId, doc) {
		// change modified date
		Blogs.update(doc.blogId, {$set: {modified: Date.now()}});
		doc.version =  1;
		//doc.modified = Date.now();
		/*
		var versionning = {};
		_.extend(versionning, doc, {modifiedBy: userId});
		Meteor.call('addPostVersion', versionning);
		*/
	});


	// Copy post in postVersion before updated
	// TODO : refactoring
	Posts.before.update(function (userId, doc, fieldNames, modifier, options) {

		var versionning = {};
		_.extend(versionning, doc, {modifiedBy: userId});
		Meteor.call('addPostVersion', versionning);

		var newInc = doc.version+1;
		if (!modifier.$set) modifier.$set = {};
		modifier.$set.version = newInc;
		modifier.$set.modified = Date.now();
	});


	Posts.before.remove(function (userId, doc) { 
		var deletionTime = Date.now();

		Meteor.call('tagsEdit', {blogId: doc.blogId, newTags: [], oldTags: doc.tags}, function(error) { // Decrement tags nRefs
			if (error) {
				throwError(error.reason);
			}
 		});

		var image = Images.findOne({'metadata.postId': doc.imageId}); // Remove image
		if (image){
			 // TODO : remove image (not only from collection)
			Images.remove(image._id);
		}

		var author = Authors.findOne({blogId: doc.blogId, name: doc.author});
		Authors.update(author._id, {$inc: {nRefs: -1}}); // Decrement author nRefs

		var category = Categories.findOne({blogId: doc.blogId, name: doc.category});
		if (category)
			Categories.update(category._id, {$inc: {nRefs: -1}}); // Decrement category nRefs

		// Add post to posts versions
		// TODO : refactoring
		var blog = Blogs.findOne(doc.blogId);
		var oldPosts = [];
		if (blog.oldPosts !== undefined) {
			oldPosts = blog.oldPosts;
		}
		oldPosts.push(doc._id);
		Blogs.update(doc.blogId, {$set: {oldPosts: oldPosts, modified: Date.now()}});

		doc.version =  doc.version++;
		doc.modified = Date.now();
		var versionning = {};
		_.extend(versionning, doc, {modifiedBy: userId, last: true});
		Meteor.call('addPostVersion', versionning);
	});
}


Meteor.methods({

	addLikeComment: function(data) {
		Posts.update({_id:data.currentPostId,"comments.id":data.currentCommentId}, {$push: {"comments.$.likes": data.author}});
	},
	removeLikeComment: function(data) {
		Posts.update({_id:data.currentPostId,"comments.id":data.currentCommentId}, {$pull: {"comments.$.likes": data.author}});
	},
	postInsert: function(postAttributes) {
		check(postAttributes.blogId, String);

		if (Meteor.settings.public)
			var postFromCloud = !(Meteor.settings.public.isBox === "true"); // Set where post is submitted (box or cloud)

		item = Authors.findOne({blogId: postAttributes.blogId, name: postAttributes.author});
		Authors.update(item, {$inc: {nRefs: 1}});
		post = _.extend(postAttributes, {
			authorId: Authors.findOne({blogId: postAttributes.blogId, name: postAttributes.author})._id,
			submitted: Date.now(),
			nb: Posts.find({blogId: postAttributes.blogId}).count() + 1,
			pinned : false,
			postFromCloud: postFromCloud // Workaround bug sync
		});

		var blog = Blogs.findOne(postAttributes.blogId);

		category = Categories.findOne({blogId: postAttributes.blogId, name: postAttributes.category}); // Increment category nRefs
		Categories.update(category, {$inc: {nRefs: 1}});

		post._id = Posts.insert(post);		
		return post._id;
	}
});