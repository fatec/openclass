Meteor.startup(function() {

    process.env.MAIL_URL = 'smtp://vincent.widmer@beekee.ch:1234512345@mail.infomaniak.com:587/';          


        Accounts.emailTemplates.from = "beekee.ch <vincent.widmer@beekee.ch>";
        //Accounts.emailTemplates.resetPassword.subject = "Réinitialisation de votre mot de passe";
        //Accounts.emailTemplates.resetPassword.text = "Bonjour, \n\n Vous avez demandé à réinitialiser votre mot de passe beekee.ch. \n\n Cliquez sur ce lien :";

Accounts.emailTemplates.resetPassword.text = function (user, url) {
   return "Bonjour, \n\n Vous avez demandé à réinitialiser votre mot de passe beekee.ch. \n\n Cliquez sur ce lien :"
     + url;
};

        Accounts.urls.resetPassword = function(token) {
    return 'http://beekee.ch/reset-password/' + token;
  };

/*
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
*/



    return Meteor.methods({

		removeGhostImages: function() {

			return Images.remove({'metadata.postId': { $exists : false }});
    	},
    	
		createUserFromAdmin:function(password,username){

        	Accounts.createUser({password:password,username:username})
  		}
    });
});


Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  }
});


