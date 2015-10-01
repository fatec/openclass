Template.postSubmit.events({
  // TODO: on cancel.. effacer toutes les images de imagesToDelete et aussi celle de imagetoAdd 
  'submit form': function(e, template) {
   e.preventDefault();
    
    var author = Session.get(this.blog._id).author;  
    var body = $(e.target).find('[name=body]').val();
    var blogId = template.data.blog._id;
    var imageId = Session.get("imageId");
    var tags = $(e.target).find('[name=tags]').val().split(',');

    var imagesToDelete = Session.get('imagesToDelete');
    imagesToDelete.forEach(function(imageId) {
        Images.remove(imageId);
    });
   
    Meteor.call('postInsert', {author: author, body: body, blogId: blogId, imageId: imageId, tags: tags}, function(error, postId) {
      if (error){
        console.log("Il y a une erreur dans postSumbit metor.call postinsert");
        console.log(error.reason);
      } else {
        if (imageId) {
          Images.update(imageId, {$unset: {'metadata.unvalid': ''},$set: {'metadata.postId': postId, 'metadata.blogId': blogId, 'metadata.last': true}});
        }
        if (tags) {
          //console.log("On ajout les tags coté client ou serveur?");
          Meteor.call('tagsInsert', {blogId: blogId, tags: tags} );
        }
        Router.go('blogPage', {_id: post.blogId});
      };
    });

    Session.set("sortPosts", "last");



  },
  'change .post-submit--input-file': function(event, template) {
    $(".post-submit--input-file-button").hide();

    FS.Utility.eachFile(event, function(file) {
      var blogId = template.data.blog._id;

      var newFile = new FS.File(file);
      newFile.metadata = {blogId: blogId, postId: "unknown yet", unvalid: true, last: true};

      var imageId = Images.insert(newFile, function (err, fileObj) {
        Session.set('imageId', imageId._id);
        Session.set('imageToAdd', imageId._id);
      });


    });
  },
    'click .post-submit--button-submit': function(e) {
    e.preventDefault();
    $('#post-submit--form').submit();
  },
  'click .post-submit--button-delete-image': function(e) {
    e.preventDefault();
    if (confirm("Effacer l'image?")) {
      var toDeleteImages = Session.get('imagesToDelete');
      var nextImageId = Session.get('imageId');
      toDeleteImages.push(nextImageId);
      Session.set('imagesToDelete', toDeleteImages);
      Session.set('imageToAdd', false);
      Session.set('imageId', false);
    }  
  }
});

Template.postSubmit.helpers({
 image: function() {
    var imageId = Session.get("imageId");

    if (imageId) {
      return Images.findOne(imageId);
    } else {
      return false
    }

  }
});

Template.postSubmit.rendered = function(){

    // Set default author
  if (!Session.get(Template.parentData(2).blog._id))
  {
    Session.set(Template.parentData(2).blog._id, {author: 'Invité'});    
  }

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