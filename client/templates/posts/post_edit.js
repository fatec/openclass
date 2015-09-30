Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = this.post._id;
    var body = $(e.target).find('[name=body]').val();

    // tags est le tableau contenant les tags 
    var oldTags = this.post.tags;
    console.log("anciens tags "+oldTags);
    // tags est le tableau contenant les tags 
    var newTags = $(e.target).find('[name=tags]').val().split(',');
    console.log("nouveaux tags "+newTags);
    // il faudrait enlever les espaces avant et après pour chacun des tags

    // si l'image à été changée

    var unset = {dummy: ''};
    var set = {tags: newTags};
    var currentPost = Posts.findOne(currentPostId);
    // Changement de body?

    if (body != this.post.body) {
      console.log("On a changé le body");
      _.extend(set, {body: body});
    }
    // Changement d'image?
    var imageToDelete = Session.get('imageToDelete');
    var imageToAdd = Session.get('imageToAdd');
    if (!imageToAdd && typeof imageToDelete == "string" ) {
      console.log("On souhaite effacer l'image "+imageToDelete+" mais en ajouter aucune");
      _.extend(unset, {imageId: ""});
    } else if (typeof imageToAdd == "string") {
      console.log("On souhaite ajouter une image "+imageToAdd);
      console.log("On souhaite effacer l'image "+imageToDelete);
      _.extend(set, {imageId: imageToAdd});
      // On doit aussi modifier le metadata de l'image ajoutée pour dire qu'elle est valide?
    } else if (!imageToAdd && !imageToDelete) {
      console.log("Rien ne change pour l'image");
    } 


      Posts.update(currentPostId, {$unset: unset, $set: set}, function(error) {
      if (error) {
        // display the error to the user
        console.log("#### Error update post ###");
        console.log(error.reason);
      } else {
        Meteor.call('tagsEdit', {blogId: blogId, newTags: newTags, oldTags: oldTags}, function(error) {
          if (error) {
            console.log("#### Error tag edit ####");
            console.log(error.reason);
          } else {
            console.log("Appelons la méthode pour effacer toutes les images intermédiares du blog "+currentPost.blogId+" et du post "+currentPost._id);
            if (typeof imageToAdd == "string") {
              Images.update(imageToAdd, {$unset: {'metadata.unvalid': ""}});
            }
            Meteor.call('deleteUnvalidImages', {blogId: currentPost.blogId, postId: currentPost._id}, function(error) {
              if (error) {
                console.log("#### Error delete unvalid images ####");
                console.log(error.reason);
              } else {
                Router.go('blogPage', {_id: currentPost.blogId});
              }
            });
            
          }
       });
      }
    });


/*
    var currentPost = Posts.findOne(currentPostId);
// 

    if (body==''){
      Posts.update(currentPostId, {$unset: {body: ''}, $set: {tags: newTags}}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
        console.log("#### unset ###");
//        console.log(Posts.simpleSchema().namedContext().invalidKeys());
        console.log("##############");
        console.log(error.reason);
      } else {
        Meteor.call('tagsEdit', {blogId: blogId, newTags: newTags, oldTags: oldTags}, function(error) {
          if (error) {
            console.log("#### tag update1 ####");
            throwError(error.reason);
          } else {
            Router.go('blogPage', {_id: currentPost.blogId});
          }
       });
      }
    });
    } else {

      Posts.update(currentPostId, {$set: {body: body, tags: newTags}}, function(error) {
      if (error) {
        // display the error to the user
        //throwError(error.reason);
        console.log("#### set ####");
 //       console.log(Posts.simpleSchema().namedContext().invalidKeys());
        console.log("##############");
        console.log(error.reason);
      } else {
        Meteor.call('tagsEdit', {blogId: blogId, newTags: newTags, oldTags: oldTags}, function(error) {
          if (error) {
            console.log("#### tag update2 ####");
            throwError(error.reason);
          } else {
            Router.go('blogPage', {_id: currentPost.blogId});
          }
       });
      }
    });
    }*/

  },
    'click .post-edit--button-submit': function(e) {
    e.preventDefault();
    $('#post-edit--form').submit();
  },
  'click .post-edit--button-delete-image': function(e) {
    e.preventDefault();
    if (confirm("Effacer l'image?")) {
      var currentPostId = this.post._id;

      if (Session.get('imageToDelete')=='') {
        console.log("on veux effacer l'image "+this.post.imageId)
        Session.set('imageToDelete', Session.get("imageId"));
        Session.set('imageToAdd', false);
        Session.set('imageId', false);
      } else {
        console.log("on veux effacer plusieurs fois l'image? "+Session.get('imageToDelete')+" et "+this.post.imageId);
        // faut il garder une trace de toutes les images intermédaires que l'on a pas ajouté?

        Session.set('imageToDelete', Session.get("imageId"));
        Session.set('imageToAdd', false);
        Session.set('imageId', false);
      }

      /*
      var image = Images.findOne({'metadata.postId': currentPostId});
      if (image){
        //console.log("On efface l'image "+image._id);

        // When we delete we remove the image from post.imageId
        //Posts.update(this.post._id, {$unset: {imageId: 1}})
        // if we 
        
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
      */
    }
  },
  'change .post-edit--input-file': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      var currentPostId = template.data.post._id;
      //console.log("Posts.findOne("+currentPostId+").blogId");
      var blogId = Posts.findOne({_id: currentPostId}).blogId;

      var newFile = new FS.File(file);
      newFile.metadata = {blogId: blogId, postId: currentPostId, unvalid: true};

      console.log("On veux ajouter une image ");
      var imageId = Images.insert(newFile, function (err, fileObj) {
        Session.set('imageId', imageId._id);
        Session.set('imageToAdd', imageId._id);
        console.log("C'est l'image "+imageId._id);
/*        Posts.update(currentPostId, {
          $set: {imageId: imageId}
        });
*/
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP

/*
          if (Session.get('imageToAdd')=='') {
            console.log("on veux effacer l'image "+this.post.imageId)
            Session.set('imageToAdd', imageId);
          } else {
            console.log("on veux effacer plusieurs fois l'image? "+Session.get('imageToDelete')+" et "+this.post.imageId)
          }
*/
      });


    });
  }
});

Template.postEdit.helpers({
  image: function() {
    var imageId = Session.get("imageId");

    if (imageId) {
      //console.log("On a récupéré l'image "+imageId);
      return Images.findOne(imageId);
    } else {
      //console.log("On a pas d'image");
      return false
    }
    // Version en cherchant dans les images
    //console.log(Images.findOne({'metadata.blogId': this.post.blogId, 'metadata.postId': this.post._id}));
    //return Images.findOne({'metadata.blogId': this.post.blogId, 'metadata.postId': this.post._id});

  },
  blog: function() {
    var currentPostId = this.post._id;
    var currentPost = Posts.findOne(currentPostId);
    var blogId = Blogs.findOne(currentPost.blogId);
    return blogId
  }
});

//Template.postEdit.onRendered = function(){
  Template.postEdit.onRendered(function () {


    // Set default author
  // if (!Session.get(Template.parentData(2).blog._id))
  // {
  //   Session.set(Template.parentData(2).blog._id, {author: 'Invité'});    
  // }

    // Textarea autosize
  $('.post-edit--textarea').autosize();



    //proposedTags = Tags.find({blogId: this.data.blogId});
    //console.log("On veux proposer les tags du blog. Il y en a "+proposedTags.count());

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
        source: tags.ttAdapter()
      }, 
      confirmKeys: [32, 9, 13, 44]
    });

    $('.suggest').tagsinput('input').blur(function() {
      console.log("ok");
        $('.suggest').tagsinput('add', $(this).val());
        $(this).val('');
    })



    //$('#prefetch .typeahead').typeahead(null, {
    //  // `ttAdapter` wraps the suggestion engine in an adapter that
    //  // is compatible with the typeahead jQuery plugin
    //  name: 'states',
    //  source: function(){
    //    return ['Mumbai', 'Amsterdam', 'Paris']
    //  }
    //
    //});
  

});
