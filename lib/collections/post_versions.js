PostsVersions = new Mongo.Collection('postsVersions');

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
