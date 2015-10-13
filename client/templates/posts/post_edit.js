Template.postEdit.events({
  // TODO : On cancel.. remove all images de imagesToDelete sauf la [0] et aussi celle de imagesToAdd (ou alors effacer toutes les unvalid qui correspondent a ce postId)
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

    if (body != this.post.body) { // body changed
      _.extend(set, {body: body});
    }

    var category = $(e.target).find('[name=category]').val();
    if (category != this.post.category) {
      _.extend(set, {category: category})
      
      // Increment category list
      var newCategoryItem = Categories.findOne({blogId: blogId, name: category});
      if (newCategoryItem)
        Categories.update(newCategoryItem._id, {$inc: {nRefs: 1}});    

      // Decrement category list
      var oldCategoryItem = Categories.findOne({blogId: blogId, name: this.post.category});
      if (oldCategoryItem)
        Categories.update(oldCategoryItem._id, {$inc: {nRefs: -1}});         
    }

    // Changement d'image?
    var imagesToDelete = Session.get('imagesToDelete');
    var imageToAdd = Session.get('imageToAdd');
    if (!imageToAdd && typeof imagesToDelete[0] == "string" ) { // Delete an image but don't add any
      _.extend(unset, {imageId: ""});
    } else if (typeof imageToAdd == "string") { // Delete one image and add one
      _.extend(set, {imageId: imageToAdd});
    } else if (!imageToAdd && !imagesToDelete) { // Nothings happens with images..
    } 


      Posts.update(currentPostId, {$unset: unset, $set: set}, function(error) {
      if (error) {
        console.log(error.reason);
      } else {
        Meteor.call('tagsEdit', {blogId: blogId, newTags: newTags, oldTags: oldTags}, function(error) {
          if (error) {
            console.log(error.reason);
          } else {
            if (typeof imageToAdd == "string") {
              Images.update(imageToAdd, {$unset: {'metadata.unvalid': ""}, $set: {'metadata.last': true}});
            }
            //var imagesToDelete = Session.get('imagesToDelete');
            console.log("On doit effacer "+imagesToDelete.length+" images");
            
            if (imagesToDelete.length > 1) {
              var imageItem =  1;
              while (imageItem < imagesToDelete.length) {
                Images.remove(imagesToDelete[imageItem]);
                imageItem++;
              }
            }
            
            Router.go('blogPage', {_id: currentPost.blogId});  
          }
       });
      }
    });
  },
    'click .post-edit--button-submit': function(e) {
    e.preventDefault();
    $('#post-edit--form').submit();
  },
  'click .post-edit--button-delete-image': function(e) {
    e.preventDefault();
    if (confirm("Effacer l'image?")) {
      var currentPostId = this.post._id;

      
      var toDeleteImages = Session.get('imagesToDelete');
      var nextImageId = Session.get('imageId');
      toDeleteImages.push(nextImageId);
      console.log("On voudra effacer l'image "+nextImageId);
      Session.set('imagesToDelete', toDeleteImages);
      Session.set('imageToAdd', false);
      Session.set('imageId', false);

    }
  },
  'change .post-edit--input-file': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      var currentPostId = template.data.post._id;
      var blogId = Posts.findOne({_id: currentPostId}).blogId;

      var newFile = new FS.File(file);
      newFile.metadata = {blogId: blogId, postId: currentPostId, unvalid: true};

      var imageId = Images.insert(newFile, function (err, fileObj) {
        Session.set('imageId', imageId._id);
        Session.set('imageToAdd', imageId._id);
      });


    });
  }
});

Template.postEdit.helpers({
  image: function() {
    var imageId = Session.get("imageId");

    if (imageId) {
      return Images.findOne(imageId);
    } else {
      return false
    }

  },
  blog: function() {
    var currentPostId = this.post._id;
    var currentPost = Posts.findOne(currentPostId);
    var blogId = Blogs.findOne(currentPost.blogId);
    return blogId
  },
    categories: function() {
    var currentPostId = this.post._id;
    var currentPost = Posts.findOne(currentPostId);
    var blogId = Blogs.findOne(currentPost.blogId);
    return Categories.find({blogId: blogId._id});  
  },
    selectedCategory: function(){
    var category = this.name;
    var categoryItem = Template.parentData().post.category;
    return category === categoryItem;
  },  
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