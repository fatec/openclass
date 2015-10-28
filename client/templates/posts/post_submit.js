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


    // loadImage(
    //     file,
    //     function (img) {
    //         document.body.appendChild(img);
    //     },
    //     {maxWidth: 600} // Options
    // );


      //myCanvasFunction(file, function (image) {
      //myResizeFunction(file, function (image) {
      myCanvasFunctionExif(file, function (image) {
        var newFile = image;
        //console.log("newFile1 "+ newFile);

      var newFile = new FS.File(newFile);
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

  //this.$('.post-submit--textarea').focus();

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



// CANVAS image manipulation


var myCanvasFunction1 = function(file, callback){
  var canvas = document.createElement("canvas");
 // Create an image
  var img = document.createElement("img");
 
 /* 
  var reader = new FileReader();
  reader.onload = function(e) {

    var img = new Image();
    img.onload = function (imageEvent) {

    // use canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // resize image
    var MAX_WIDTH = 800;
    var MAX_HEIGHT = 600;
    var width = img.width;
    var height = img.height;
     
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    resizedImage = canvas.toDataURL('image/jpeg');
    callback(resizedImage);
    }
    img.src = e.target.result

  }
  reader.readAsDataURL(file);

*/




  var img = new Image();
  img.onload = function (imageEvent) {
    // use canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // resize image
    var MAX_WIDTH = 800;
    var MAX_HEIGHT = 600;
    var width = img.width;
    var height = img.height;
     
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    // edit the image
    var imgData = ctx.createImageData(width, height);
    var data = imgData.data;
    var pixels = ctx.getImageData(0, 0, width, height);
    for (var i = 0, ii = pixels.data.length; i < ii; i += 4) {
        var r = pixels.data[i + 0];
        var g =pixels.data[i + 1];
        var b = pixels.data[i + 2];
        data[i + 0] = (r * .393) + (g *.769) + (b * .189);
        data[i + 1] = (r * .349) + (g *.686) + (b * .168)
        data[i + 2] = (r * .272) + (g *.534) + (b * .131)
        data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);    


// TODO rote image on client with exif
/*
    // rotate image
    var exif = EXIF.readFromBinaryFile(new BinaryFile(file));

    switch(exif.Orientation){

       case 8:
           ctx.rotate(90*Math.PI/180);
           break;
       case 3:
           ctx.rotate(180*Math.PI/180);
           break;
       case 6:
           ctx.rotate(-90*Math.PI/180);
           break;


    }
    */


    resizedImage = canvas.toDataURL('image/jpeg');
    //callback(dataURItoBlob2(resizedImage));
    callback(resizedImage);
  }

  // There are two options here. You can either use a FileReader (from the File API) or use the new createObjectURL() method.
  img.src = window.URL.createObjectURL(file);

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
            MinifyJpegAsync.minify(e.target.result, 100, function(minified) {
              var enc = "data:image/jpeg;base64," + btoa(minified);
              callback(enc);
            });

        }
    })(file);
    reader.readAsDataURL(file);

    }








var myCanvasFunctionExif = function(file, callback){
  var canvas = document.createElement("canvas");
   // Create an image
      var img = document.createElement("img");
      // Create a file reader
      var reader = new FileReader();
      // Set the image once loaded into file reader



         reader.onload = function (readerEvent) {
              var image = new Image();
              image.onload = function (imageEvent) {

                  //Resize the image
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

                  //width = 200;
                  //height = 350;
                  canvas.width = width;
                  canvas.height = height;
                  ctx = canvas.getContext('2d');
                  console.log("au début :"+canvas.width)


    //                   ctx.clearRect(0,0,canvas.width,canvas.height);

    // // save the unrotated context of the canvas so we can restore it later
    // // the alternative is to untranslate & unrotate after drawing
    // ctx.save();

    // // move to the center of the canvas
    // ctx.translate(canvas.width/2,canvas.height/2);

    // // rotate the canvas to the specified degrees
    // ctx.rotate(98*Math.PI/180);

    // // draw the image
    // // since the context is rotated, the image will be rotated also
    // ctx.drawImage(image,-image.width/2,-image.width/2);

    // // we’re done with the rotating so restore the unrotated context
    // ctx.restore();

                  //ctx.rotate(0.6);

                                     EXIF.getData(image, function() {
                        var make = EXIF.getTag(image, "Make"),
                            model = EXIF.getTag(image, "Model");
                            orientation = EXIF.getTag(image, "Orientation");
                        console.log("I was taken by a " + make + " " + model + "Orientation : " + orientation);
                    });

                  switch(orientation){
    case 2:
        // horizontal flip
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        break;
    case 3:
        // 180° rotate left
        ctx.translate(canvas.width, canvas.height);
        ctx.rotate(Math.PI);
        break;
    case 4:
        // vertical flip
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        break;
    case 5:
        // vertical flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.scale(1, -1);
        break;
    case 6:
        // 90° rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(0, -canvas.height);
        break;
    case 7:
        // horizontal flip + 90 rotate right
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(canvas.width, -canvas.height);
        ctx.scale(-1, 1);
        break;
    case 8:
        // 90° rotate left
        ctx.rotate(-0.5 * Math.PI);
        ctx.translate(-canvas.width, 0);
        break;
}




console.log("après :"+canvas.width);
//canvas.height = height;
                  ctx.drawImage(image,0,0,width,height);



//canvas.height = newHeight + 'px';

       //                  switch('3'){

       // case 8:
       //     ctx.rotate(90*Math.PI/180);
       //     break;
       // case 3:
       //     ctx.rotate(180*Math.PI/180);
       //     break;
       // case 6:
       //     ctx.rotate(-90*Math.PI/180);
       //     break;
         //}
                  //ctx.drawImage(image, 0, 0, width, height);

                  console.log(ctx);


                  resizedImage = canvas.toDataURL('image/jpeg');
                  callback(resizedImage);





              }

              image.src = readerEvent.target.result;
                  //console.log(ctx);

      // switch('6'){

      //  case 8:
      //      image.rotate(90*Math.PI/180);
      //      break;
      //  case 3:
      //      image.rotate(180*Math.PI/180);
      //      break;
      //  case 6:
      //      file.rotate(-90*Math.PI/180);
      //      break;
      //    }
              // image.src = readerEvent.target.result;
              // console.log(image.src);
              


          }
          reader.readAsDataURL(file);



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



/* To minify a jpeg image without loosing EXIF.
 * TESTED(24/01/2013): FireFox, GoogleChrome, IE10, Opera
 * Copyright (c) 2013 hMatoba
 * Released under the MIT license
 */

var MinifyJpegAsync = (function () {
    "use strict";
    var that = {};

    that.minify = function (image, new_size, callback) {
        var imageObj = new Image(),
            rawImage = [],
            imageStr = "";

        if (typeof (image) == "string") {
            if (image.match("data:image/jpeg;base64,")) {
                rawImage = that.decode64(image.replace("data:image/jpeg;base64,", ""));
                imageStr = image;
            } else if (image.match("\xff\xd8")) {
                for (var p=0; p<image.length; p++) {
                    rawImage[p] = image.charCodeAt(p);
                }
                imageStr = "data:image/jpeg;base64," + btoa(image);
            } else {
                throw "MinifyJpeg.minify got a not JPEG data";
            }
        } else {
            throw "First argument must be 'string'.";
        }

        imageObj.onload = function () {
            var segments = slice2Segments(rawImage),
                NEW_SIZE = parseInt(new_size),
                size = imageSizeFromSegments(segments),
                chouhen = (size[0] >= size[1]) ? size[0] : size[1];
            var exif,
                resized,
                newImage;

            if (chouhen <= NEW_SIZE) {
                newImage = atob(imageStr.replace("data:image/jpeg;base64,", ""));
            } else {
                exif = getExif(segments);
                resized = resize(imageObj, segments, NEW_SIZE);

                if (exif.length) {
                    newImage = insertExif(resized, exif);
                } else {
                    newImage = atob(resized.replace("data:image/jpeg;base64,", ""));
                }
            }

            callback(newImage);
        };
        imageObj.src = imageStr;

    };


    that.encode64 = function (input) {
        var binStr = "";
        for (var p=0; p<input.length; p++) {
            binStr += String.fromCharCode(input[p]);
        }
        return btoa(binStr);
    };


    that.decode64 = function (input) {
        var binStr = atob(input);
        var buf = [];
        for (var p=0; p<binStr.length; p++) {
            buf[p] = binStr.charCodeAt(p);
        }
        return buf;
    };


    var imageSizeFromSegments = function (segments) {
        var seg,
            width,
            height,
            SOF = [192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207];
        for (var x = 0; x < segments.length; x++) {
            seg = segments[x];
            if (SOF.indexOf(seg[1]) >= 0) {
                height = seg[5] * 256 + seg[6];
                width = seg[7] * 256 + seg[8];
                break;
            }
        }
        return [width, height];
    };


    var getImageSize = function (imageArray) {
        var segments = slice2Segments(imageArray);
        return imageSizeFromSegments(segments);
    };


    var slice2Segments = function (rawImageArray) {
        var head = 0,
            segments = [];
        var length,
            endPoint,
            seg;

        while (1) {
            if (rawImageArray[head] == 255 && rawImageArray[head + 1] == 218) {
                break;
            }
            if (rawImageArray[head] == 255 && rawImageArray[head + 1] == 216) {
                head += 2;
            } else {
                length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
                endPoint = head + length + 2;
                seg = rawImageArray.slice(head, endPoint);
                segments.push(seg);
                head = endPoint;
            }
            if (head > rawImageArray.length) {
                break;
            }
        }

        return segments;
    };


    var resize = function (img, segments, NEW_SIZE) {
        var size = imageSizeFromSegments(segments),
            width = size[0],
            height = size[1],
            chouhen = (width >= height) ? width : height,
            newSize = NEW_SIZE,
            scale = parseFloat(newSize) / chouhen,
            newWidth = parseInt(parseFloat(newSize) / chouhen * width),
            newHeight = parseInt(parseFloat(newSize) / chouhen * height);
        var canvas,
            ctx,
            srcImg,
            newCanvas,
            newCtx,
            destImg;

        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        srcImg = ctx.getImageData(0, 0, width, height);

        newCanvas = document.createElement('canvas');
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;
        newCtx = newCanvas.getContext("2d");
        destImg = newCtx.createImageData(newWidth, newHeight);
        bilinear(srcImg, destImg, scale);

        newCtx.putImageData(destImg, 0, 0);
        return newCanvas.toDataURL("image/jpeg");
    };


    var getExif = function (segments) {
        var seg;
        for (var x = 0; x < segments.length; x++) {
            seg = segments[x];
            if (seg[0] == 255 && seg[1] == 225) //(ff e1)
            {
                return seg;
            }
        }
        return [];
    };


    var insertExif = function (imageStr, exifArray) {
        var buf = that.decode64(imageStr.replace("data:image/jpeg;base64,", ""));
        if (buf[2] != 255 || buf[3] != 224) {
            throw "Couldn't find APP0 marker from resized image data.";
        }
        var app0_length = buf[4] * 256 + buf[5];
        var newImage = [255, 216].concat(exifArray, buf.slice(4 + app0_length));
        var jpegData = "";
        for (var p=0; p<newImage.length; p++) {
            jpegData += String.fromCharCode(newImage[p]);
        }
        return jpegData;
    };


    // compute vector index from matrix one
    var ivect = function (ix, iy, w) {
        // byte array, r,g,b,a
        return ((ix + w * iy) * 4);
    };


    var inner = function (f00, f10, f01, f11, x, y) {
        var un_x = 1.0 - x;
        var un_y = 1.0 - y;
        return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
    };


    var bilinear = function (srcImg, destImg, scale) {
        // taking the unit square
        var srcWidth = srcImg.width;
        var srcHeight = srcImg.height;
        var srcData = srcImg.data;
        var dstData = destImg.data;
        var i, j;
        var iyv, iy0, iy1, ixv, ix0, ix1;
        var idxD, idxS00, idxS10, idxS01, idxS11;
        var dx, dy;
        var r, g, b, a;
        for (i = 0; i < destImg.height; ++i) {
            iyv = (i + 0.5) / scale - 0.5;
            iy0 = Math.floor(iyv);
            iy1 = (Math.ceil(iyv) > (srcHeight - 1) ? (srcHeight - 1) : Math.ceil(iyv));
            for (j = 0; j < destImg.width; ++j) {
                ixv = (j + 0.5) / scale - 0.5;
                ix0 = Math.floor(ixv);
                ix1 = (Math.ceil(ixv) > (srcWidth - 1) ? (srcWidth - 1) : Math.ceil(ixv));
                idxD = ivect(j, i, destImg.width);
                idxS00 = ivect(ix0, iy0, srcWidth);
                idxS10 = ivect(ix1, iy0, srcWidth);
                idxS01 = ivect(ix0, iy1, srcWidth);
                idxS11 = ivect(ix1, iy1, srcWidth);

                dx = ixv - ix0;
                dy = iyv - iy0;

                //r
                dstData[idxD] = inner(srcData[idxS00], srcData[idxS10],
                    srcData[idxS01], srcData[idxS11], dx, dy);

                //g
                dstData[idxD + 1] = inner(srcData[idxS00 + 1], srcData[idxS10 + 1],
                    srcData[idxS01 + 1], srcData[idxS11 + 1], dx, dy);

                //b
                dstData[idxD + 2] = inner(srcData[idxS00 + 2], srcData[idxS10 + 2],
                    srcData[idxS01 + 2], srcData[idxS11 + 2], dx, dy);

                //a
                dstData[idxD + 3] = inner(srcData[idxS00 + 3], srcData[idxS10 + 3],
                    srcData[idxS01 + 3], srcData[idxS11 + 3], dx, dy);

            }
        }
    };


    return that;
})();


