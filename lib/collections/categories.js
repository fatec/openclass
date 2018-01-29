Categories = new Mongo.Collection('categories'); // Store all categories

// TODO : add server-side security

Categories.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});


Meteor.methods({

	categoryInsert: function(name, blogId) {
		Categories.insert({name: name, blogId: blogId, nRefs: 0});
	},
	categoryEdit: function(blogId, oldName, newName) {
		var category = Categories.findOne({name: oldName, blogId: blogId});
		Categories.update(category._id, {$set: {name:newName}}, function(error) {
			if (error) {
				console.log("Error when changing category name : "+error.message);
			}
			else {
				Posts.update({blogId:blogId, category: oldName},{$set: {category: newName}}, {multi: true}); // Update all author posts with new name
			}
		});
	}
});