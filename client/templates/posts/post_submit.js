Template.postSubmit.events({
  // TODO: on cancel.. effacer toutes les images de imagesToDelete et aussi celle de imagetoAdd 
  'submit form': function(e, template) {
   e.preventDefault();
    
    var author = Session.get(this.blog._id).author;  
    var body = $(e.target).find('[name=body]').val();
    var blogId = template.data.blog._id;
    var imageId = Session.get("imageId");
    var tags = $(e.target).find('[name=tags]').val().split(',');
    var category = $(e.target).find('[name=category]').val();

    var imagesToDelete = Session.get('imagesToDelete');
    imagesToDelete.forEach(function(imageId) {
        Images.remove(imageId);
    });
   
    Meteor.call('postInsert', {author: author, body: body, blogId: blogId, imageId: imageId, tags: tags, category: category}, function(error, postId) {
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

      //myCanvasFunction(file, function (image) {
      myResizeFunction(file, function (image) {
        var newFile = image;
        //console.log("newFile1 "+ newFile);



      var newFile = new FS.File(newFile);

      newFile.name(file.name);

      newFile.metadata = {blogId: blogId, postId: "unknown yet", unvalid: true, last: true};

      var imageId = Images.insert(newFile, function (err, fileObj) {
        if (err) console.log("ERREUR "+err);
        Session.set('imageId', imageId._id);
        Session.set('imageToAdd', imageId._id);

      });
      //console.log("newFile "+ newFile);


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

  },
  categories: function() {
    return Categories.find({blogId: this.blog._id});  
  }  
});





Template.postSubmit.rendered = function(){

    // Set default author
  if (!Session.get(Template.parentData(2).blog._id))
  {
    Session.set(Template.parentData(2).blog._id, {author: 'Invité'});    
  }

  // Textarea autosize
  $('.post-submit--textarea').autosize()


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
                    max_size = 100,
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


