Template.admin.helpers({

	user: function(){
		return Meteor.users.find({},{sort: {createdAt: -1}});
	},
	isOnline: function() {
		if (this.status.online)
			return true
	},
	userCreatedAt: function() {
		return moment(this.createdAt).format("DD/MM/YYYY HH:mm");
	}
});