Template.blogItem.helpers({
	ownBlog: function() {
		if (this.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
    		return true;
  	},
  	memberBlog: function() {
  		if (typeof Blogs.findOne({_id:this._id, memberUserEmail: Meteor.user().emails[0].address}) != "undefined")
  			return true;
  	}
});