// Upload images with tomitrescak:meteor-uploads

Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads',
    checkCreateDirectories: true,
	getDirectory: function(fileInfo, formData) {
		return '/';
	},
	finished: function(fileInfo, formFields) {
		console.log(fileInfo.size);
	// Resize and auto-orient uploaded images with GraphicMagicks
    gm(process.env.PWD+'/.uploads/'+fileInfo.name).autoOrient().resize('1200','1200').write(process.env.PWD+'/.uploads/'+fileInfo.name,Meteor.bindEnvironment(function (err, res) {if(err){console.log("Error when resizing :"+err)}else {Images.insert({imageId:fileInfo.name});
}}));

	},
    getFileName: function(fileInfo, formData) { 
    // Set a new random image name
	var extension = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();
	var newName = Random.id() + '.' + extension;
	return newName;
	},
	cacheTime: 0,
  });
});