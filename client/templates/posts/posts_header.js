  Template.postsHeader.helpers({
  isAdmin: function() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
        return true;
	},
	authors: function() {
		return Authors.find({blogId: this.blog._id});  
	},  
	optionIsSelected: function(authorName) {
		return authorName === Session.get(Template.parentData(1).blog._id).author;
	}  
});

  Template.postsHeader.events({
	'change .header--select-author': function(event) {
		event.preventDefault();
		Session.set(this.blog._id, {author: $(event.target).val()});    
	} 
});