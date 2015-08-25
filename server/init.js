Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    checkCreateDirectories: true,
    getDirectory: function(fileInfo, formData) {
      if (formData && formData.directoryName != null) {
        return formData.directoryName;
      }
      return "";
    },
    getFileName: function(fileInfo, formData) {

      var fileName = formData.blogId+"-"+Date.now()+"."+getFileExtension(fileInfo.name);
      //console.log("On peut nommer le ficher "+ formData.blogId+"."+getFileExtension(fileInfo.name));
      //console.log("formData.prefix c'est "+formData.prefix)
      if (formData && formData.blogId != null) {
        return fileName;
      }
      return fileInfo.name;
    },
    finished: function(fileInfo, formData) {
      if (formData && formData._id != null) {
        Items.update({_id: formData._id}, { $push: { uploads: fileInfo }});
      }
    }
  });
});


function getFileExtension(filename) {
  return filename.split('.').pop();
}

