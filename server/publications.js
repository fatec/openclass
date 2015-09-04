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



Meteor.publish("images", function(blogId){ return Images.find({'metadata.blogId': blogId}); });
Meteor.publish("postImage", function(postId){ return Images.find({'metadata.postId': postId}); });
Meteor.publish("tags", function(blogId){ return Tags.find({blogId: blogId}); });