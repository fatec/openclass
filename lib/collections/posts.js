Posts = new Mongo.Collection('posts');

Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      blogId: String,
      body: String
    });
    
    var user = Meteor.user();
    var blog = Blogs.findOne(postAttributes.blogId);

    if (!blog)
      throw new Meteor.Error('invalid-post', 'Il faut écrire la publication dans un journal');
    
    post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    
    
    // create the post, save the id
    post._id = Posts.insert(post);
    
    // now create a notification, informing the user that there's been a post
    //createPostNotification(post);
    
    return post._id;
  }
});
