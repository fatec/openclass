// Meteor.startup(function () {
//   UploadServer.init({
//     tmpDir: process.env.PWD + '/.uploads/',
//     uploadDir: process.env.PWD + '/.uploads/',
//     checkCreateDirectories: true,
//     finished: function(fileInfo, formFields) {
//       alert("hum");
//     }, 
//       });
// });



Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    //uploadDir: process.env.PWD + '/public/uploads/',
    //uploadDir: process.env.PWD + '/.uploads/',
    checkCreateDirectories: true,
	getDirectory: function(fileInfo, formData) {
		return '/';
	},
	finished: function(fileInfo, formFields) {
        gm(process.env.PWD+'/.uploads/'+fileInfo.name).autoOrient().resize('1200','1200').write(process.env.PWD+'/.uploads/originals/'+fileInfo.name,Meteor.bindEnvironment(function (err, res) {if(err){console.log("Error when resizing :"+err)}else {Images.insert({imageId:fileInfo.name});}}));
	},
	validateFile: function(fileInfo, req) {
		// TODO check if jpg,gif,etc
    },
    getFileName: function(fileInfo, formData) { 
    			console.log("hehe");

    	var extension = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();
    	var newName = Random.id() + '.' + extension;
    	return newName;
	},
	cacheTime: 0,
	//getFileName: function(file) { return Random.id(); }
  });
});