Meteor.startup(function() {

    return Meteor.methods({

		removeGhostImages: function() {

			return Images.remove({'metadata.postId': { $exists : false }});
    	}
    });
});