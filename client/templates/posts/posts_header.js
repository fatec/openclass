  Template.postsHeader.helpers({
  isAdmin: function() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
        return true;
	},
	authors: function() {
		return Authors.find({blogId: this._id});  
	},  
	optionIsSelected: function(authorName) {
		return authorName === Session.get("author");
	}  
});

  Template.postsHeader.events({
	'change .header--select-author': function(event) {
		event.preventDefault();
		//console.log($(event.target).val());
		Session.set("author", $(event.target).val());    
	}
});