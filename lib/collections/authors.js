Authors = new Mongo.Collection('authors');

Meteor.methods({
  authorInsert: function(name, blogId) {
    Authors.insert({name: name, blogId: blogId, nRefs: 0});
  },
});

Authors.allow({

remove: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); },

// remove: function (userId, post){
//     return userId;    
// },

update: function() { return true },

// update: function(userId, post) {
//     return userId;    
// }
});

/*
Lors de la création des tags
Tags.add(blogId, tag)
	Si !tag alors on ajoute blogId, tag, nRefs=1
	Si tag alors nRefs+=1 et on ajoute blogId au tableau blogs s'il n'y est pas deja 

*/

/*
Tags.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 60
  },
  blogId: {
    type: String,
    label: "Blog Id"
  },
  nRefs: {
    type: Number,
    label: "Number of references",
    min: 0
  }
}));
*/