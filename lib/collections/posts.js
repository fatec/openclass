Posts = new Mongo.Collection('posts');

Posts.allow({


// TODO : add security

remove: function() {return true;},

//remove: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); },

// remove: function (userId, post){
//     return userId;    
// },

update: function() {return true;}
//update: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); },

// update: function(userId, post) {
//     return userId;    
// }
});

Posts.deny({
  // update: function(userId, post, fieldNames) {
  //   // may only edit the following two fields:
  //   //return (_.without(fieldNames, 'body').length > 0);
  //   return false;
  // }
});



// Pour l'historique il faut un hook before pour tout.. et noter tout ce qui se passe..
Posts.before.remove(function (userId, doc) {
  console.log("On souhaite effacer un post.. il faut enlever les tags associés.");
  Meteor.call('tagsEdit', {blogId: doc.blogId, newTags: [], oldTags: doc.tags}, function(error) {
    if (error) {
      console.log("#### Zut une erreur dans le hook Posts.before.delete ####");
      throwError(error.reason);
    }
 });

  console.log("il faut aussi effacer les images associées")
  var image = Images.findOne({'metadata.postId': doc.imageId});
  if (image){
    //console.log("On efface l'image "+image._id);
    Images.remove(image._id, function(error, file){
      if (error) {
        // display the error to the user
        //throwError(error.reason);
        console.log("Erreur hook before post remove "+error.reason);
      }       
    });
  };

  console.log("il faut ajouter le post id au tableau des anciens posts");
  var blog = Blogs.findOne(doc.blogId);
  var oldPosts = [];
  if (blog.oldPosts !== undefined) {
    oldPosts = blog.oldPosts;
  }
  oldPosts.push(doc._id);
  Blogs.update(doc.blogId, {$set: {oldPosts: oldPosts, modified: Date.now()}});

  // On met à jour l'historique
  doc.version =  doc.version++;
  doc.modified = Date.now();
  var versionning = _.extend({postId: doc._id, modifiedBy: userId, last: true}, doc);
  PostsVersions.insert(versionning);
});

/*
Posts.before.update(function (userId, doc, fieldNames, modifier, options) {
  // change modified date
  Blogs.update(doc.blogId, {$set: {modified: Date.now()}});

  modifier.$set.version = doc.version++;
  modifier.$set.modifiedAt = Date.now();

  var versionning = _.extend({postId: doc._id, modifiedBy: userId}, doc);
  PostsVersions.insert(versionning);

});
*/


Posts.before.insert(function (userId, doc) {
  // change modified date
  Blogs.update(doc.blogId, {$set: {modified: Date.now()}});
  doc.version =  1;
  doc.modified = Date.now();
  var versionning = _.extend({postId: doc._id, modifiedBy: userId}, doc);
  PostsVersions.insert(versionning);
});



Meteor.methods({
  postInsert: function(postAttributes) {
    // Attention que faire si pas de userId

    //check(this.userId, String);
    check(postAttributes.blogId, String);
    console.log("author = "+postAttributes.author);
    console.log("blogId ="+postAttributes.blogId);

 //   console.log(Authors.findOne({blogId: postAttributes.blogId, name: 'Enseignant'}));
  //  check(postAttributes.body, String) || check(postAttributes.imageId, String)

    if (Meteor.user())
    {
      check(this.userId, String);
      var user = Meteor.user();
      post = _.extend(postAttributes, {
        userId: user._id,
        author: user.username,
        submitted: Date.now()
      });
    }
    else
    {
      item = Authors.findOne({blogId: postAttributes.blogId, name: postAttributes.author});
      Authors.update(item, {$inc: {nRefs: 1}});
      post = _.extend(postAttributes, {
        authorId: Authors.findOne({blogId: postAttributes.blogId, name: postAttributes.author})._id,
        submitted: Date.now()
      });
    }


    var blog = Blogs.findOne(postAttributes.blogId);

    

    if (!blog)
      throw new Meteor.Error('invalid-post', 'Il faut écrire la publication dans un journal');
    
    // Si user connected alors userId = user.id 
    // Sinon c'est un "étudiant"/"guest" et alors userId = blog.userId ou alors guestId ou alors null
    // post = _.extend(postAttributes, {
    //   userId: user._id,
    //   //author: user.username,
    //   submitted: Date.now()
    // });
    
    //console.log("Notre objet post: "+ Object.keys(post));

    // create the post, save the id
    post._id = Posts.insert(post);
    
    // now create a notification, informing the user that there's been a post
    //createPostNotification(post);
    
    return post._id;
  },
  deleteUnvalidImages: function (postAttributes) {
    console.log("On souhaite effacer les images du blog "+postAttributes.blogId+" et du post "+postAttributes.postId);
    Images.remove({'metadata.blogId': postAttributes.blogId, 'metadata.postId': postAttributes.postId, 'metadata.unvalid': true});
  }

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
