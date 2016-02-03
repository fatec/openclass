Images = new Mongo.Collection('images');

Meteor.methods({
});

Images.allow({

  insert: function() {return true },

  remove: function() {return true},

//remove: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); },

// remove: function (userId, post){
//     return userId;    
// },

update: function() { return true }

// update: function(userId, post) {
//     return userId;    
// }
});