Template.postSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    // On récupère la valeur du champ body ainsi que le blogId trasféré par le router
    var author = Session.get("author");    
    var body = $(e.target).find('[name=body]').val();
    var blogId = template.data.blog._id;
    var imageId = Session.get("imageId");

    // tags est le tableau contenant les tags 
    var tags = $(e.target).find('[name=tags]').val().split(',');
    // il faudrait enlever les espaces avant et après pour chacun des tags


   
    Meteor.call('postInsert', {author: author, body: body, blogId: blogId, imageId: imageId, tags: tags}, function(error, postId) {
      if (error){
        throwError(error.reason);
      } else {
        imageId = Session.get("imageId");
        if (imageId) {
          delete Session.keys['imageId']
          Images.update({_id: imageId}, {$set: {'metadata.postId': postId, 'metadata.blogId': blogId}});
        }
        if (tags) {
          //console.log("On ajout les tags coté client ou serveur?");
          Meteor.call('tagsInsert', {blogId: blogId, tags: tags} );
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
/*
  'click #photo': function(event, template) {
    $(".post-submit--input-file-button").hide();

    var file = $(event.target).find('[type=file]');
    console.log("On veux ajouter la photo "+Object.keys(file.context));
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
  },*/
    'click .post-submit--button-submit': function(e) {
    e.preventDefault();
    $('#post-submit--form').submit();
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
    var imageId = Session.get("imageId");

    if (imageId) {
      //console.log("On a récupéré l'image "+imageId);
      return Images.findOne(imageId);
    } else {
      //console.log("On a pas d'image");
      return false
    }
    //return Images.findOne({'metadata.timestamp': this.timestamp}); // Where Images is an FS.Collection instance
  }
});

Template.postSubmit.rendered = function(){
  this.$('.post-submit--textarea').focus();

  // Textarea autosize
  $('.post-submit--textarea').autosize()

    /*
    proposedTags = Tags.find({blogId: this.data.blog._id});
    //console.log("On veux proposer les tags du blog. Il y en a "+proposedTags.count());
    processed_data = [];
    proposedTags.forEach(function(row) {
        //console.log(row.name)
        processed_data.push({name: row.name});
    });
    */

    var tags = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: Tags.find().fetch()
    });
    tags.initialize();

    //$('[data-role="tagsinput"]').tagsinput();

    
    $('.suggest').tagsinput({
      typeaheadjs: {
        name: 'tags',
        displayKey: 'name',
        valueKey: 'name',
        source: tags.ttAdapter(),
      }, 
      confirmKeys: [32, 9, 13, 44]
    });

    $('.suggest').tagsinput('input').blur(function() {
        $('.suggest').tagsinput('add', $(this).val());
        $(this).val('');
    })
/*
    $('.bootstrap-tagsinput input').blur(function() {
        $('.myinputfield').tagsinput('add', $(this).val());
        $(this).val('');
    });
*/

    //$('.typeahead').typeahead(null, {
    //  // `ttAdapter` wraps the suggestion engine in an adapter that
    //  // is compatible with the typeahead jQuery plugin
    //  name: 'tags',
    //  source: function(){
    //    return ['Mumbai', 'Amsterdam', 'Paris']
    //  }
    //
    //});
}