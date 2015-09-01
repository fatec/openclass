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
    // Attention que faire si pas de userId
    //console.log("On tente le postInsert");
    //console.log("userId "+this.userId);
    //console.log("postAttributes.blogId "+postAttributes.blogId);

    check(this.userId, String);
    check(postAttributes.blogId, String);
  //  check(postAttributes.body, String) || check(postAttributes.imageId, String)

    var user = Meteor.user();
    var blog = Blogs.findOne(postAttributes.blogId);

    

    if (!blog)
      throw new Meteor.Error('invalid-post', 'Il faut écrire la publication dans un journal');
    
    post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    
    //console.log("Notre objet post: "+ Object.keys(post));

    // create the post, save the id
    post._id = Posts.insert(post);
    
    // now create a notification, informing the user that there's been a post
    //createPostNotification(post);
    
    return post._id;
  },

});


Posts.attachSchema(new SimpleSchema({
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
   /* custom: function() {
      if(!this.body) {
        return 'required';
      }
    }*/
  },
  body: {
    type: String,
    label: "Body",
    optional: true,
   /* custom: function() {
      if(!this.imageId) {
        return 'required';
      }
    }*/
  },
  tags: {
    type: [String],
    label: "Tags",
    optional: true
  }
}));
