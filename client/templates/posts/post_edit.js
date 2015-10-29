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
    $(".post-submit--input-file-button").hide();

    FS.Utility.eachFile(event, function(file) {
    var currentPostId = template.data.post._id;
    var blogId = Posts.findOne({_id: currentPostId}).blogId;

    var extension = file.name.substr(file.name.lastIndexOf('.')+1).toLowerCase();
    if (extension == "jpg" || extension == "jpeg") {


            //myCanvasFunction(file, function (image) {
            myResizeFunction(file, function (image) {
              var newFile = image;
              //console.log("newFile1 "+ newFile);

            var newFile = new FS.File(newFile);

            newFile.name(file.name);
            
            newFile.metadata = {blogId: blogId, postId: currentPostId, unvalid: true};

            var imageId = Images.insert(newFile, function (err, fileObj) {
              if (err) console.log("ERREUR "+err);
              Session.set('imageId', imageId._id);
              Session.set('imageToAdd', imageId._id);

            });
            //console.log("newFile "+ newFile);

            });
      } else if (extension == "gif" || extension == "png") {
            myCanvasFunction(file, function (image) {
            //myResizeFunction(file, function (image) {
              var newFile = image;
              //console.log("newFile1 "+ newFile);

            var newFile = new FS.File(newFile);

            newFile.name(file.name);
            
            newFile.metadata = {blogId: blogId, postId: currentPostId, unvalid: true};

            var imageId = Images.insert(newFile, function (err, fileObj) {
              if (err) console.log("ERREUR "+err);
              Session.set('imageId', imageId._id);
              Session.set('imageToAdd', imageId._id);

          });
          //console.log("newFile "+ newFile);


          });
      }


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
    // TODO resolve error log while changing picture
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



var myResizeFunction = function(file, callback){

var canvas = document.createElement("canvas");
 // Create an image
    var img = document.createElement("img");
    // Create a file reader

    var reader = new FileReader();
    reader.onloadend = (function(theFile)
    {
        return function(e)
        {
            MinifyJpegAsync.minify(e.target.result, 1000, function(minified) {
              var enc = "data:image/jpeg;base64," + btoa(minified);
              
              $('.post-edit--spinner').hide();

              callback(enc);
            });

        }
    })(file);
    reader.readAsDataURL(file);
    $('.post-edit--spinner').show();

}







var myCanvasFunction = function(file, callback){

var canvas = document.createElement("canvas");
 // Create an image
    var img = document.createElement("img");
    // Create a file reader
    var reader = new FileReader();
    // Set the image once loaded into file reader



       reader.onload = function (readerEvent) {
            var image = new Image();
            image.onload = function (imageEvent) {

                // Resize the image
                var canvas = document.createElement('canvas'),
                    max_size = 1000,
                    width = image.width,
                    height = image.height;
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d').drawImage(image, 0, 0, width, height);




                resizedImage = canvas.toDataURL('image/jpeg');
callback(resizedImage);
            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
    }



