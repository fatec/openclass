FS.debug = true
/*
Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images",  {path: "~/uploads"})]
});
*/


var createThumb = function(fileObj, readStream, writeStream) {
  // Transform the image into a 10x10px thumbnail
  gm(readStream, fileObj.name()).density('72','72').quality(80).autoOrient().resize('500', '400').stream().pipe(writeStream);

};

/*
// Pour Utiliser GridFS 
// meteor add cfs:gridfs
var imageStoreThumbs = new FS.Store.GridFS("thumbs", { transformWrite: createThumb });
var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
 stores: [imageStoreThumbs, imageStore],
 filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
 }
});

*/

// Pour utiliser FileSystem
// meteor add cfs:filesystem
Images = new FS.Collection("images", {
  stores: [
    new FS.Store.FileSystem("thumbs", { transformWrite: createThumb }),
    new FS.Store.FileSystem("images"),
  ],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});


Images.allow({
 insert: function(){
 return true;
 },
 update: function(){
 return true;
 },
 remove: function(){
 return true;
 },
 download: function(){
 return true;
 }
});