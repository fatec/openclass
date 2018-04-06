Authors = new Mongo.Collection('authors'); // Store author list

// TODO : add server-side security

Authors.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});

Meteor.methods({

	authorInsert: function(name, blogId) {
		Authors.insert({name: name, blogId: blogId, nRefs: 0});
	},
	authorEdit: function(blogId, oldName, newName) {
		var author = Authors.findOne({name: oldName, blogId: blogId});
		Authors.update(author._id, {$set: {name:newName}}, function(error) {
			if (error) {
				console.log("Error when changing author name : "+error.message);
			}
			else {
				Posts.update({blogId:blogId, author: oldName},{$set: {author: newName}}, {multi: true}); // Update all author posts with new name
			}
		});
	}
});