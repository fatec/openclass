  Template.postSubmitHeader.helpers({
	authors: function() {
		//console.log(Template.parentData(1).blog._id);

		
				return Authors.find({blogId: Template.parentData(2).blog._id, isUser: {$not: true}});  

		//return Authors.find({blogId: Template.parentData(2).blog._id});  
	},
	optionIsSelected: function(authorName) {
		return authorName === Session.get(Template.parentData(1).blog._id).author;
	} 
});

  Template.postSubmitHeader.events({
	'change .header--select-author': function(event) {
		event.preventDefault();
		Session.set(this.blog._id, {author: $(event.target).val()});    
	} 
});