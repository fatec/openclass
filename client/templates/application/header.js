Template.header.helpers({
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

Template.header.events({
    'click .header--button-back-wrapper': function(e) {
        e.preventDefault();
        history.back();
    },
	'change .header--select-author': function(event) {
		event.preventDefault();
		Session.set(this.blog._id, {author: $(event.target).val()});    
	}    
});