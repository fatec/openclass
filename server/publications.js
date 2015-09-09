Meteor.publish('blogs', function() {
  return Blogs.find();
});

Meteor.publish('posts', function(blogId) {
  check(blogId, String);
  return Posts.find({blogId: blogId});
});

Meteor.publish('postsTag', function(options) {
  check(options, {
  	blogId: String,
  	tag: String 
  });
  console.log("Posts.find({blogId: '"+options.blogId+"', tags: {$in: ['"+options.tag+"']}});");
  return Posts.find({blogId: options.blogId, tags: {$in: [options.tag]}});
});	

Meteor.publish('postsEdit', function(postId) {
  check(postId, String);
  return Posts.find({_id: postId});
});	

Meteor.publish('allUsers', function() {
   return Meteor.users.find({}, {fields:{username:1}})
 })

Meteor.publish("images", function(blogId){ return Images.find({'metadata.blogId': blogId}); });
Meteor.publish("postImage", function(postId){ return Images.find({'metadata.postId': postId}); });
Meteor.publish("tags", function(blogId){ return Tags.find({blogId: blogId}); });