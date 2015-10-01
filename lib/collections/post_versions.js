PostsVersions = new Mongo.Collection('postsVersions');




	Meteor.methods({
	  addPostVersion: function(postAttributes) {
	  	PostsVersions.insert({
	  		postId: postAttributes._id,
	  		modifiedBy: postAttributes.userId,
	  		blogId: postAttributes.blogId,
	  		userId: postAttributes.userId,
	  		author: postAttributes.author,
	  		submitted: postAttributes.submitted,
	  		modified: postAttributes.modified,
	  		imageId: postAttributes.imageId,
	  		body: postAttributes.body,
	  		tags: postAttributes.tags,
	  		version: postAttributes.version,
	  		last: postAttributes.last
	  	});
	  }
	});

/*

Garder l'historique des posts

_id: {
	type: String,
	label: 
},
postId: {
	type: String,
	label: "Post Id"
}
blogId: {
	type: String,
	label: "Blog Id"
},
userId: {
	type: String,
	label: "User Id"
},
author: {
	type: String,
	label: "Author name",
	max: 200
},
submitted: {
	type: Date,
	label: "Submission date"
},
modified: {
	type: Date,
	label: "Last modification date",
	optional: true
},
imageId: {
	type: String,
	label: "Image Id",
	optional: true,
},
body: {
	type: String,
	label: "Body",
	optional: true,
},
tags: {
	type: [String],
	label: "Tags",
	optional: true
}
version: {
	type: Integer
	label: "version"
}

*/
