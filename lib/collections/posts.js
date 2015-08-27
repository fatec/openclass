Posts = new Mongo.Collection('posts');

Posts.allow({
remove: function (userId, post){
    return userId;    
},

update: function(userId, post) {
    return userId;    
}
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    //return (_.without(fieldNames, 'body').length > 0);
    return false;
  }
});


Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes.blogId, String);
  //  check(postAttributes.body, String) || check(postAttributes.imageId, String)

    var user = Meteor.user();
    var blog = Blogs.findOne(postAttributes.blogId);

    console.log("blog "+blog.title);

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
  },

});
