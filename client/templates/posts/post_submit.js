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

      myCanvasFunction(file, function (image) {
        var newFile = image;
        console.log("newFile1 "+ newFile);

      var newFile = new FS.File(newFile);
      newFile.metadata = {blogId: blogId, postId: "unknown yet", unvalid: true, last: true};

      var imageId = Images.insert(newFile, function (err, fileObj) {
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


var myCanvasFunction = function(file, callback){
  console.log("File !!!!"+file);

var canvas = document.createElement("canvas");
 // Create an image
    var img = document.createElement("img");
    // Create a file reader
    var reader = new FileReader();
    // Set the image once loaded into file reader


console.log("DEBUG 1");

       reader.onload = function (readerEvent) {
            var image = new Image();
console.log("DEBUG 2");
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
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                resizedImage = canvas.toDataURL('image/jpeg');
console.log("DEBUG 3 "+dataURLToBlob(resizedImage));
callback(dataURLToBlob(resizedImage));
            }
            image.src = readerEvent.target.result;
//console.log("DEBUG 4 "+image.src);
        }
        reader.readAsDataURL(file);
console.log("DEBUG 5 "+reader.readAsDataURL(file));
    }




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


/* Utility function to convert a canvas to a BLOB */
var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}