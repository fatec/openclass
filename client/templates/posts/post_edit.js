Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id;
    
    var postProperties = {
      body: $(e.target).find('[name=body]').val()
    }
    //console.log(postProperties.body);

   // var errors = validatePost(postProperties);
   // if (errors.title || errors.url)
   //   return Session.set('postEditErrors', errors);
    var currentPost = Posts.findOne(currentPostId);
    //console.log(currentPost.blogId);


    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        //throwError(error.reason);
        console.log(error.reason);
      } else {
        Router.go('blogPage', {_id: currentPost.blogId});
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      var currentPost = Posts.findOne(currentPostId);
      Posts.remove(currentPostId);

      var image = Images.findOne({'metadata.postId': currentPostId});
      if (image){
        //console.log("On efface l'image "+image._id);
        Images.remove(image._id, function(error, file){
          if (error) {
            // display the error to the user
            //throwError(error.reason);
            console.log(error.reason);
        };        
      });
      };

      Router.go('blogPage', {_id: currentPost.blogId});
    };
  },


  'click .deleteImage': function(e) {
    e.preventDefault();
    if (confirm("Effacer l'image?")) {
      var currentPostId = this._id;
      var image = Images.findOne({'metadata.postId': currentPostId});
      if (image){
        //console.log("On efface l'image "+image._id);
        Images.remove(image._id, function(error, file){
          if (error) {
            // display the error to the user
            //throwError(error.reason);
            console.log("Il y a une erreur ici "+error.reason);
        } else {
          //console.log("Posts.update("+currentPostId+",{$unset: {imageId: 1}});");
          Posts.update(currentPostId, {$unset: {imageId: 1}
          });
        };        
      });
      };
    }
  },


  'change .myFileInput': function(event, template) {
    /* 
      Upload en utilisant le change event
    */
    FS.Utility.eachFile(event, function(file) {
      var currentPostId = template.data._id;
      //console.log("Posts.findOne("+currentPostId+").blogId");
      var blogId = Posts.findOne({_id: currentPostId}).blogId;

      var newFile = new FS.File(file);
      newFile.metadata = {blogId: blogId, postId: currentPostId};
      // TODO On ajoute le timestamp a l'image pour retrouver l'image lorsque l'on envoie le formulaire et la lier au post

      var imageId = Images.insert(newFile, function (err, fileObj) {
      Posts.update(currentPostId, {
        $set: {imageId: imageId}
      });

        //console.log("Image Inserted with id "+fileObj._id);
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });

    });
  }


});

Template.postEdit.helpers({
  image: function() {
/*    console.log("Les données dispo ici: ");
    console.log("body: "+ this.body);
    console.log("blogId: "+this.blogId);
    console.log("_id: "+this._id);*/
    //return "coucou";
    //return Images.findOne();
    return Images.findOne({'metadata.blogId': this.blogId, 'metadata.postId': this._id});
  }
});
