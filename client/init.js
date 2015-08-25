
Meteor.startup(function() {
  Uploader.uploadUrl = Meteor.absoluteUrl("upload"); // Cordova needs absolute URL
  Uploader.finished = function(index, fileInfo, templateContext) {
    //Uploads.insert(fileInfo);
    console.log("Index: "+ index+" fileInfo: "+fileInfo+" templateContext: "+templateContext);
  }
  Uploader.logLevel = Uploader.logLevels.debug;
});

