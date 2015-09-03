
Posts = new Mongo.Collection('posts');

Posts.allow({
remove: function (userId, post){
    return userId;    
},

update: function(userId, post) {
    return true;    
},

insert: function(userId, post) {
    console.log("On regarde si on a le droit d'inserer le post");
    return true;    
}
});
/*
Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    //return (_.without(fieldNames, 'body').length > 0);
    return false;
  }
});
*/

// Pour les champs automatiques (dates et userID)
// Voir l'exemple ici:
// http://stackoverflow.com/questions/30668659/error-when-updating-an-object-in-auto-form-with-meteor

Posts.attachSchema(new SimpleSchema({
  blogId: {
    type: String,
    label: "Blog Id",
    optional: true
  },
  userId: {
    type: String,
    label: "User Id",
    optional: true
  },
  author: {
    type: String,
    label: "Author name",
    max: 200,
    optional: true
  },
  submitted: {
    type: Date,
    label: "Submission date",
    optional: true
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
  },
  imageId: {
    type: String,
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: "images"
      }
    },
    optional: true
  }
}));


Meteor.methods({
  postInsert: function(postAttributes){
    //console.log("On essaie de faire un post Insert sur le server!!!!!");
    //console.log("this userId: "+this.userId);
    console.log("postAttributes: "+Object.keys(postAttributes));
    // On récupère postAttributes.imageId
    var imageId = postAttributes.imageId;
    console.log("imageId: "+imageId);
    // On récupère postAttributes.body
    var body = postAttributes.body;
    // On récupère postAttributes.tags
    var tags = postAttributes.tags;
    console.log("tags: "+tags);
    var blogId = postAttributes.blogId;
    var userId = this.userId;
    var user = Meteor.user();

    // vérifier que user.id == userId

    // On vérifie le type
    try {
      mySchema = Posts.simpleSchema();
      check(postAttributes, mySchema);    
      check(userId, String);
      check(blogId, String);
      mySchema.clean(postAttributes);
    }catch(e){
      throw new Meteor.Error(e);
    }

    // On vérifie que le blog existe
    var blog = Blogs.findOne(postAttributes.blogId);
    if (!blog) {
      throw new Meteor.Error('invalid-post', 'Il faut écrire la publication dans un journal');   
    }

    post = _.extend(postAttributes, {
      userId: userId,
      author: user.username,
      submitted: new Date()
    });
    console.log("Notre objet post: "+ Object.keys(post));

    // create the post, save the id
    post._id = Posts.insert(post);

    // On ajoute le champ blogId et imageId à l'image uploadée
    if (post.imageId) {
      console.log("Il y a une image.. on ajoute les champs postId et blogId");
      Images.update({_id: post.imageId}, {$set: {'metadata.postId': post._id, 'metadata.blogId': post.blogId}});      
    } else {
      console.log("Il n'y a pas d'image avec ce post");
    }

    Router.go('blogPage', {_id: post.blogId});
    //return post._id;
  }

});


/*
Meteor.methods({
  postInsert: function(postAttributes) {
    // Attention que faire si pas de userId
    //console.log("On tente le postInsert");
    //console.log("userId "+this.userId);
    //console.log("postAttributes.blogId "+postAttributes.blogId);

    console.log("postAttributes "+Object.keys(postAttributes));

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
*/
