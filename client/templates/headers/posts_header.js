Template.postsHeader.helpers({
	
	authorName: function() {
		if (Session.get(this.blog._id).author)
		return Session.get(this.blog._id).author; 
	},    
	submitAllowed: function() {
		if (this.blog.postEditPermissions !== undefined) {
			if (this.blog.postEditPermissions === "none" && Roles.userIsInRole(Meteor.userId(), ['admin']) != true && this.blog.userId != Meteor.userId())
				return false
			else
				return true
		}
		else 
			return true
	},
});