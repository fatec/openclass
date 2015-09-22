Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id;
    var body = $(e.target).find('[name=body]').val();

    // tags est le tableau contenant les tags 
    var oldTags = this.tags;
    console.log("anciens tags "+oldTags);
    // tags est le tableau contenant les tags 
    var newTags = $(e.target).find('[name=tags]').val().split(',');
    console.log("nouveaux tags "+newTags);
    // il faudrait enlever les espaces avant et après pour chacun des tags



    /*
    var postProperties = {
      body: $(e.target).find('[name=body]').val()
    }
    */

    var currentPost = Posts.findOne(currentPostId);


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
    }

  },
    'click .post-edit--button-submit': function(e) {
    e.preventDefault();
    $('#post-edit--form').submit();
  },
  'click .post-edit--button-delete-image': function(e) {
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
            Posts.update(currentPostId, {$unset: {imageId: 1}});
          };        
        });
      };
    }
  },
  'change .post-edit--input-file': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      var currentPostId = template.data._id;
      //console.log("Posts.findOne("+currentPostId+").blogId");
      var blogId = Posts.findOne({_id: currentPostId}).blogId;

      var newFile = new FS.File(file);
      newFile.metadata = {blogId: blogId, postId: currentPostId};

      var imageId = Images.insert(newFile, function (err, fileObj) {
        Posts.update(currentPostId, {
          $set: {imageId: imageId}
        });
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
    });
  }
});

Template.postEdit.helpers({
  image: function() {
    return Images.findOne({'metadata.blogId': this.blogId, 'metadata.postId': this._id});
  },
  blog: function() {
    var currentPostId = this._id;
    var currentPost = Posts.findOne(currentPostId);
    var blogId = Blogs.findOne(currentPost.blogId);
    return blogId
  }
});

Template.postEdit.rendered = function(){

    // Textarea autosize
  $('.post-edit--textarea').autosize()

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
  

}
