Template.blogItem.helpers({
	ownBlog: function() {
		if (this.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
    		return true;
  	}
});
