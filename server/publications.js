Meteor.publish('blogs', function() {
  return Blogs.find();
});

Meteor.publish('blogsVersions', function() {
  return BlogsVersions.find();
});

Meteor.publish('posts', function(blogId) {
  check(blogId, String);
    //return Posts.find({blogId: blogId});
  return Posts.find({blogId: blogId}, {sort: {submitted: 1}});
});

Meteor.publish('postsVersions', function(blogId) {
  check(blogId, String);
  return PostsVersions.find({blogId: blogId}, {sort: {submitted: 1}});
});

Meteor.publish('postsEdit', function(postId) {
  check(postId, String);
  return Posts.find({_id: postId});
});	

Meteor.publish('allUsers', function() {
  return Meteor.users.find();
 })

//Meteor.publish("images", function(blogId){ return Images.find({'metadata.blogId': blogId, 'metadata.last': true}); });
Meteor.publish("images", function(blogId){ return Images.find({blogId: blogId}); });
Meteor.publish("images2", function(blogId){ return Images.find();});

Meteor.publish("postImage", function(postId){ return Images.find({'metadata.postId': postId}); });
Meteor.publish("tags", function(blogId){ return Tags.find({blogId: blogId}); });
Meteor.publish("authors", function(blogId){ return Authors.find({blogId: blogId}); });
Meteor.publish("categories", function(blogId){ return Categories.find({blogId: blogId}); });
Meteor.publish("codes", function(){ return Codes.find()});

// Meteor.publish("userStatus", function() {
//   return Meteor.users.find({ "status.online": true });
// });