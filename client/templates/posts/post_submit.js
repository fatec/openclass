// file: client/init.js
// Meteor.startup(function() {
//   Uploader.finished = function(index, fileInfo, templateContext) {
//     Images.insert({postId:post._id,imageId:fileInfo.name});
//     //console.log("je rajoute l'image"+fileInfo.name);

//   }
// })

Template.postSubmit.events({
  // TODO: on cancel.. effacer toutes les images de imagesToDelete et aussi celle de imagetoAdd 
  'submit form': function(e, template) {
   e.preventDefault();

  // Show a spiner while sending
    $(".post-submit--button-spinner").show();
    $(".post-submit--button-icon").hide();
    $(".post-submit--button-text").hide();

    
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
        alert("Une erreur a été rencontrée. Vérifiez votre connexion et réessayez.")
      } else {
          //$( ".post-submit--button-submit" ).removeClass( "fa-cog" );
        // if (imageId) {
        //   Images.update(imageId, {$unset: {'metadata.unvalid': ''},$set: {'metadata.postId': postId, 'metadata.blogId': blogId, 'metadata.last': true}});
        // }
        if (tags) {
          //console.log("On ajout les tags coté client ou serveur?");
          Meteor.call('tagsInsert', {blogId: blogId, tags: tags} );
        }
        Router.go('blogPage', {_id: post.blogId});
      };
    });

    Session.set("sortPosts", "last");



  },
  'change .post-submit--input-file2': function(event, template) {
    $(".post-submit--input-file-wrapper").hide();




    // FS.Utility.eachFile(event, function(file) {
    //   var blogId = template.data.blog._id;   

    //   var extension = file.name.substr(file.name.lastIndexOf('.')+1).toLowerCase();

    //   if (extension == "jpg" || extension == "jpeg") {
    //   //myCanvasFunction(file, function (image) {
    //       myResizeFunction(file, function (image) {
    //         var newFile = image;
    //         //console.log("newFile1 "+ newFile);



    //       var newFile = new FS.File(newFile);

    //       newFile.name(file.name);

    //       newFile.metadata = {blogId: blogId, postId: "unknown yet", unvalid: true, last: true};

    //       var imageId = Images.insert(newFile, function (err, fileObj) {
    //         if (err) console.log("ERREUR "+err);
    //         Session.set('imageId', imageId._id);
    //         Session.set('imageToAdd', imageId._id);

    //       });
    //       //console.log("newFile "+ newFile);


    //       });
    //   } else if (extension == "gif" || extension == "png") {
    //     myCanvasFunction(file, function (image) {
    //         var newFile = image;
    //         //console.log("newFile1 "+ newFile);



    //       var newFile = new FS.File(newFile);

    //       newFile.name(file.name);

    //       newFile.metadata = {blogId: blogId, postId: "unknown yet", unvalid: true, last: true};

    //       var imageId = Images.insert(newFile, function (err, fileObj) {
    //         if (err) console.log("ERREUR "+err);
    //         Session.set('imageId', imageId._id);
    //         Session.set('imageToAdd', imageId._id);

    //       });
    //       //console.log("newFile "+ newFile);


    //       });
    //   }


    // });
  },
    'click .post-submit--button-submit': function(e) {
    e.preventDefault();
    $('#post-submit--form').submit();
  },
  'click .post-submit--button-delete-image': function(e) {
    e.preventDefault();
    if (confirm("Effacer l'image?")) {
      Session.set('imageId', false);
      //Images.update(imageId, {$unset: {'metadata.unvalid': ''},$set: {'metadata.postId': postId, 'metadata.blogId': blogId, 'metadata.last': true}});

      // var toDeleteImages = Session.get('imagesToDelete');
      // var nextImageId = Session.get('imageId');
      // toDeleteImages.push(nextImageId);
      // Session.set('imagesToDelete', toDeleteImages);
      // Session.set('imageToAdd', false);
      // Session.set('imageId', false);
    }  
  }
});

Template.postSubmit.helpers({
  image: function() {
    if (Session.get("imageId"))
    {
      var imageId = Session.get("imageId");
      return Images.findOne({imageId:imageId});
    }
    else
      return false;
  },
  categories: function() {
    return Categories.find({blogId: this.blog._id});  
  },
    myCallbacks: function() {
    return {
        validate: function(file) {

//console.log(file);

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
            var blob = dataURItoBlob(resizedImage);
            var fd = new FormData(document.forms[0]);
            fd.append("canvasImage", blob);
            var myFile = blobToFile(blob, "my-image.png");
            var array = [];
            array.push(myFile);
                        console.log(array);

            return array;

            }
            image.src = readerEvent.target.result;

        }
        reader.readAsDataURL(file[0]);

// return myTest(file[0], function(te) {
//   console.log("retour : "+te);
//   return te;
// })



          // return myCanvasFunction(file[0], function (image) {
          //   hop = image;
          //   console.log(image);
          //   console.log("avant");

          //   return image;
          //   //return image;

          // });
          // return file;

//return hop;

      //return file;
    }
  } 
  } 
});

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}


function myTest(file) {
  //console.log("2");


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
            var blob = dataURItoBlob(resizedImage);
            var fd = new FormData(document.forms[0]);
            fd.append("canvasImage", blob);
            //console.log(blob);
            return blob;

            }
            image.src = readerEvent.target.result;

        }
        reader.readAsDataURL(file);

    }




Template.postSubmit.rendered = function(){

if (Session.get("imageId"))
  delete Session.keys["imageId"];

    Uploader.finished = function(index, fileInfo, templateContext) {
    //Images.insert({imageId:fileInfo.name});
    Session.set("imageId",fileInfo.name);
    
  }

  //   Uploader.getFileName = function(fileInfo, formData) { 
  //     var extension = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();
  //     var newName = Random.id() + '.' + extension;
  //     return newName;
  // };

    // Set default author
  if (!Session.get(Template.parentData(2).blog._id))
  {
    Session.set(Template.parentData(2).blog._id, {author: 'Invité'});    
  }

  // Textarea autosize
  $('.post-submit--textarea').autosize();


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
        $('.suggest').tagsinput('add', $(this).val().toLowerCase());
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






var myCanvasFunction2 = function(file, callback){
console.log("2");


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
                
                var blob = dataURItoBlob(resizedImage);
                var fd = new FormData(document.forms[0]);
fd.append("canvasImage", blob);
callback(blob);
            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
    }












var myCanvasFunction = function(file, callback){
console.log("2");


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
            var blob = dataURItoBlob(resizedImage);
            var fd = new FormData(document.forms[0]);
            fd.append("canvasImage", blob);
            callback(blob);
            console.log(blob);
            return blob;

            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
    }








var myResizeFunction = function(file, callback){
   console.log("2");
var canvas = document.createElement("canvas");
 // Create an image
    var img = document.createElement("img");


    //var img2 = $('.post-submit--image');

    //$(".post-submit--image").on('load', function(){ alert("chargé!")});
    // Create a file reader


    var reader = new FileReader();
    reader.onloadend = (function(theFile)
    {
        return function(e)
        {
            MinifyJpegAsync.minify(e.target.result, 1000, function(minified) {
              var enc = "data:image/jpeg;base64," + btoa(minified);
              console.log("on a fini de resizer !");
              //$('.post-edit--spinner').hide();


              callback(enc);

            });

        }
    })(file);
    reader.readAsDataURL(file);
    console.log("on resize ma poule");
    //('.post-edit--spinner').show();

    }

    function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
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
