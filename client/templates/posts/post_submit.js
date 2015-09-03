
Template.postSubmit.helpers({
  image: function () {
    var imageId = Session.get("imageId");

    if (imageId) {
      //console.log("On a récupéré l'image "+imageId);
      return Images.findOne(imageId);
    } else {
      //console.log("On a pas d'image");
      return false
    }
    //return Images.findOne({'metadata.timestamp': this.timestamp}); // Where Images is an FS.Collection instance
  },
  myData: function () {
    var blogId = this.blog._id;
    return {
      blogId: blogId
    }
  }
});

Template.postSubmit.rendered = function(){
  this.$('.post-submit--textarea').focus() 
}


/*
Template.postSubmit.events({
  'submit formaaa': function(e, template) {
    e.preventDefault();

//console.log @data.atts;

    // On récupère la valeur du champ body ainsi que le blogId trasféré par le router
    var body = $(e.target).find('[name=body]').val();
    var tags = $(e.target).find('[name=tags]').val();
    console.log("les tags: "+tags);
    var blogId = template.data.blog._id;
    var imageId = Session.get("imageId");

   
    Meteor.call('postInsert', {body: body, blogId: blogId, imageId: imageId}, function(error, postId) {
      if (error){
        console.log("##############");
        console.log(Posts.simpleSchema().namedContext().invalidKeys());
        console.log("##############");
        throwError(error.reason);
      } else {

        imageId = Session.get("imageId");
        if (imageId) {
          delete Session.keys['imageId']
          Images.update({_id: imageId}, {$set: {'metadata.postId': postId}});
        }

        Router.go('blogPage', {_id: post.blogId});
      };
    });
  },
  'change .post-submit--input-file': function(event, template) {
    $(".post-submit--input-file-button").hide();

    FS.Utility.eachFile(event, function(file) {
      var newFile = new FS.File(file);
      //newFile.metadata = {blogId: template.data.blog._id, timestamp: template.data.timestamp};
      newFile.metadata = {blogId: template.data.blog._id};
      // TODO On ajoute le timestamp a l'image pour retrouver l'image lorsque l'on envoie le formulaire et la lier au post

      imageId = Images.insert(newFile, function (err, fileObj) {
      //console.log("On ajoute l'image Id dans la session: "+imageId._id);
      Session.set("imageId", imageId._id);
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

      Meteor.call('removeGhostImages');

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
*/

