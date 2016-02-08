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
		//imageVersions: {originals: {width: 600, height: 800}, thumbnails: {width: 300, height: 400}},

	finished: function(fileInfo, formFields) {
        gm('/Users/Vince/Dropbox/meteor/openclass/.uploads/'+fileInfo.name).autoOrient().resize('1200','1200').write('/Users/Vince/Dropbox/meteor/openclass/.uploads/originals/'+fileInfo.name,Meteor.bindEnvironment(function (err, res) {if(err){console.log("Error when resizing :"+err)}else {Images.insert({imageId:fileInfo.name});}}));

        //gm('/Users/Vince/Desktop/Dropbox/meteor/openclass/.uploads/'+fileInfo.name).autoOrient().resize('1500','1500').write('/Users/Vince/Desktop/Dropbox/meteor/openclass/.uploads/originals/'+fileInfo.name,Meteor.bindEnvironment(function (err, res) {if(err){console.log("Error when resizing :"+err)}else {Images.insert({imageId:fileInfo.name});}}));
        //gm('/Users/Vince/Desktop/Dropbox/meteor/openclass/.uploads/'+fileInfo.name).autoOrient().resize('500','500').write('/Users/Vince/Desktop/Dropbox/meteor/openclass/.uploads/thumbnails/'+fileInfo.name,function (err, res) {console.log("Error 2 when resizing :"+err)}});

        //gm('/Users/Vince/Desktop/Dropbox/meteor/openclass/public/uploads/'+fileInfo.name).autoOrient().resize('20','20').write('/Users/Vince/Desktop/Dropbox/meteor/openclass/public/uploads/thumbnails/'+fileInfo.name,function (err) {console.log("error"+err)});
        //gm('/Users/Vince/Desktop/Dropbox/meteor/openclass/public/uploads/'+fileInfo.name).autoOrient().resize('500','500').write('/Users/Vince/Desktop/Dropbox/meteor/openclass/public/uploads/originals/'+fileInfo.name,function (err) {console.log("error"+err)});
        //gm('/Users/Vince/Desktop/Dropbox/meteor/openclass/.uploads/'+fileInfo.name).autoOrient().resize('20','20').write('/Users/Vince/Desktop/Dropbox/meteor/openclass/.uploads/thumbnails/'+fileInfo.name+'?temp=32',function (err) {console.log("error"+err)});

		//alert("hum");
	},
	validateFile: function(fileInfo, req) {

		//gm('/Users/Vince/Dropbox/meteor/openclass/.uploads/'+fileInfo.name).autoOrient().resize('20','20').write('/Users/Vince/Dropbox/meteor/openclass/.uploads/'+fileInfo.name,function (err) {console.log("error"+err)});

		//console.log(req);
        // e.g. read file content
        //gm('/Users/Vince/Dropbox/meteor/openclass/.uploads/'+fileInfo.name).resize('50','50').write('/Users/Vince/Dropbox/meteor/openclass/.uploads/'+fileInfo.name,function (err) {console.log("error"+err)});
        //   gm(readStream, fileObj.name()).autoOrient().resize('600', '500').stream().pipe(writeStream);

    },
    	getFileName: function(fileInfo, formData) { 
    	var extension = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();
    	var newName = Random.id() + '.' + extension;
    	return newName;
	},
	cacheTime: 0,
	//getFileName: function(file) { return Random.id(); }
  });
});