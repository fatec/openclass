Template.postSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=body]');

    image_name = e.target.file.value;


    var post = {
      body: $body.val(),
      blogId: template.data._id
    };

    var errors = {};
    if (! post.body) {
      errors.body = "Please write some content";
      return Session.set('postSubmitErrors', errors);
    }

    Meteor.call('postInsert', post, function(error, postId) {
      if (error){
        throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  },
  'change .myFileInput': function(event, template) {
    //var file = event.target.file;
    //console.log("myfile change event "+Object.keys(file));
    /*
      Trick pour utiliser le form submit event
    */

    /* 
      Upload en utilisant le change event
    */
    FS.Utility.eachFile(event, function(file) {
      var newFile = new FS.File(file);
      newFile.metadata = {blogId: template.data.blog._id, timestamp: template.data.timestamp};
      // TODO On ajoute le timestamp a l'image pour retrouver l'image lorsque l'on envoie le formulaire et la lier au post

      Images.insert(newFile, function (err, fileObj) {

        console.log("Image Inserted with id "+fileObj._id);
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });

    });
  }
});

Template.postSubmit.helpers({
  images: function () {
    return Images.find(); // Where Images is an FS.Collection instance
  }
});




