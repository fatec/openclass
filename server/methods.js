Meteor.startup(function() {

    return Meteor.methods({

		removeGhostImages: function() {

			return Images.remove({'metadata.postId': { $exists : false }});
    	},
    	
		createUserFromAdmin:function(password,username){

        	Accounts.createUser({password:password,username:username})
  		}
    });
});