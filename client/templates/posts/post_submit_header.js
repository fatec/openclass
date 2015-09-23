  Template.postSubmitHeader.helpers({
	authors: function() {
		console.log(Template.parentData(2).blog._id);

		
				return Authors.find({blogId: Template.parentData(2).blog._id});  

		//return Authors.find({blogId: Template.parentData(2).blog._id});  
	},
	optionIsSelected: function(authorName) {
		//return authorName === Session.get("author");
	}  
});

  Template.postSubmitHeader.events({
	'change .header--select-author': function(event) {
		event.preventDefault();
		//console.log($(event.target).val());
		Session.set("author", $(event.target).val());    
	}
});