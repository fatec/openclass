Meteor.publish('blogs', function() {
  return Blogs.find();
});

Meteor.publish('posts', function(blogId) {
  check(blogId, String);
  return Posts.find({blogId: blogId});
});	
