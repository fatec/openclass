Meteor.publish('blogs', function() {
  return Blogs.find();
});

Meteor.publish('posts', function(blogId) {
  check(blogId, String);
  return Posts.find({blogId: blogId});
});	

Meteor.publish('postsEdit', function(postId) {
  check(postId, String);
  return Posts.find({_id: postId});
});	


Meteor.publish('uploads', function() {
  return Uploads.find();
})