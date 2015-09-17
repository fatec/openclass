Posts = new Mongo.Collection('posts');

Posts.allow({

remove: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); },

// remove: function (userId, post){
//     return userId;    
// },

update: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); },

// update: function(userId, post) {
//     return userId;    
// }
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    //return (_.without(fieldNames, 'body').length > 0);
    return false;
  }
});

/*
Posts.before.remove(function (userId, doc) {
  console.log("On souhaite effacer un post.. il faut enlever les tags associés.");
  Meteor.call('tagsEdit', {blogId: doc.blogId, newTags: [], oldTags: doc.tags}, function(error) {
    if (error) {
      console.log("#### Zut une erreur dans le hook Posts.before.delete ####");
      throwError(error.reason);
    }
 });
});
*/


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
      submitted: Date.now()
    });
    
    //console.log("Notre objet post: "+ Object.keys(post));

    // create the post, save the id
    post._id = Posts.insert(post);
    
    // now create a notification, informing the user that there's been a post
    //createPostNotification(post);
    
    return post._id;
  },

});


/*
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
  },
  body: {
    type: String,
    label: "Body",
    optional: true,

  },
  tags: {
    type: [String],
    label: "Tags",
    optional: true
  }
}));
*/
