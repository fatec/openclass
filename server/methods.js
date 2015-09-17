Meteor.startup(function() {

var net = Npm.require('net');
var fs = Npm.require('fs');
var buffer = Npm.require('buffer');

var wstream = fs.createWriteStream("/Users/morands/Downloads/monimage.jpg");

var server = net.createServer(function(conn) {
    console.log('server connected');

    conn.on('data', function(data) {
        console.log('data received');
        //console.log('data is: \n' + data);
        wstream.write(data);
    });
});

var HOST = '127.0.0.1';
var PORT = '9001'
var FILEPATH = '/home/morands/Downloads/';


server.listen(PORT, HOST, function() {
    //listening
    console.log('server bound to ' + PORT + '\n');

    server.on('connection', function(){
        console.log('connection made...\n')
    })
});




    return Meteor.methods({

		removeGhostImages: function() {

			return Images.remove({'metadata.postId': { $exists : false }});
    	},
    	
		createUserFromAdmin:function(password,username){

        	Accounts.createUser({password:password,username:username})
  		}
    });
});


