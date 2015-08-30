Template.postSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    // On récupère la valeur du champ body ainsi que le blogId trasféré par le router
    var $body = $(e.target).find('[name=body]');
    var post = {
      body: $body.val(),
      blogId: template.data.blog._id
    };
    // On vérifie s'il y a une image qui possède ce timestamp
    image = Images.findOne({'metadata.timestamp': template.data.timestamp, 'metadata.blogId': post.blogId})

    if (image) {
      post['imageId'] = image._id;
      //post['timestamp']=template.data.timestamp;
      //console.log("On a l'image!!!!");
    }

    var errors = {};
    if (! post.body) {
      errors.body = "Please write some content";
      return Session.set('postSubmitErrors', errors);
    }
    //console.log("post.blogId "+post.blogId+" post.body "+post.body);
   
    Meteor.call('postInsert', post, function(error, postId) {
      if (error){
        throwError(error.reason);
      } else {

        $body.val('');
        // On ajoute l'id du post à l'image associée s'il y en a une
        if (post.imageId){
          Images.update({_id: post.imageId}, {$set: {'metadata.postId': postId}});
        }
        Router.go('blogPage', {_id: post.blogId});
      };
    });
  },
  'change .post-submit--input-file': function(event, template) {
    $(".post-submit--input-file-button").hide();

    FS.Utility.eachFile(event, function(file) {
      var newFile = new FS.File(file);
      newFile.metadata = {blogId: template.data.blog._id, timestamp: template.data.timestamp};
      // TODO On ajoute le timestamp a l'image pour retrouver l'image lorsque l'on envoie le formulaire et la lier au post

      Images.insert(newFile, function (err, fileObj) {

        //console.log("Image Inserted with id "+fileObj._id);
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });

    });
  },
    'click .post-submit--button-submit': function(e) {
    e.preventDefault();
    $('#post-submit--form').submit();
  },
    'click .post-submit--button-cancel': function(e, template) {
      e.preventDefault();
      Router.go('blogPage', {_id: template.data.blog._id});
    },
  'click .post-submit--button-delete-image': function(e) {
    e.preventDefault();
    if (confirm("Effacer l'image?")) {
      var currentPostId = this._id;
      var image = Images.findOne({'metadata.timestamp': this.timestamp});
      if (image){
        //console.log("On efface l'image "+image._id);
        Images.remove(image._id, function(error, file){
          if (error) {
            // display the error to the user
            //throwError(error.reason);
            console.log("Il y a une erreur ici "+error.reason);
        } else {
            //console.log("Posts.update("+currentPostId+",{$unset: {imageId: 1}});");
            Posts.update(currentPostId, {$unset: {imageId: 1}});
          };        
        });
      };
    }
  }    
});

Template.postSubmit.helpers({
  image: function () {
    return Images.findOne({'metadata.timestamp': this.timestamp}); // Where Images is an FS.Collection instance
  }
});
