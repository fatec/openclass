
Meteor.startup(function() {
  Uploader.uploadUrl = Meteor.absoluteUrl("upload"); // Cordova needs absolute URL
  Uploader.finished = function(index, fileInfo, templateContext) {
    
// On ajoute
// blogId: templateContext.data.formData.blogId
// et les données de l'utilisateur
    upload = _.extend(fileInfo, {
      //userId: user._id,
      //author: user.username,
      blogId: templateContext.data.formData.blogId
    });

    Uploads.insert(upload);



    

    /*
    console.log("#######################");
    console.log("Index: "+ Object.keys(index))
    console.log("fileInfo: "+Object.keys(fileInfo))
    console.log("templateContext: "+Object.keys(templateContext));
    console.log("templateContext info: "+Object.keys(templateContext.info));
    console.log("templateContext view: "+Object.keys(templateContext.view));
    console.log("templateContext view name: "+templateContext.view.name);
    console.log("templateContext data: "+Object.keys(templateContext.data));
    console.log("templateContext formData: "+Object.keys(templateContext.data.formData));
    console.log("templateContext data formData: "+templateContext.data.formData.blogId);
    console.log("#######################");
    */
  }
});

