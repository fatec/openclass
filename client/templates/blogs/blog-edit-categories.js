Template.blogEditCategories.events({

	'click .blog-edit-categories--button-delete-category': function(event, template) {
		var currentBlogId = template.data.blog._id;
		var categoryName = $(event.target).data("delete-name");
		var category = Categories.findOne({name: categoryName, blogId: currentBlogId});
		if(confirm(TAPi18n.__('blog-edit-categories--confirm-delete')+" "+categoryName+" ?"))
			Categories.remove(category._id, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
	}, 
	'click .blog-edit-categories--button-edit-category': function(event, template) {
		var currentBlogId = template.data.blog._id;
		var oldName = $(event.target).data("edit-category");
		var newName = prompt(TAPi18n.__('blog-edit-categories--edit-category')+" : ",oldName);
		Meteor.call('categoryEdit', currentBlogId, oldName, newName, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
	},
	'submit form.blog-edit--form-add-category': function(e) {
		e.preventDefault();
		var currentBlogId = this.blog._id;
		var categoryName = $('#categoryName').val().trim();
		Meteor.call('categoryInsert', categoryName, this.blog._id, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
		$('#categoryName').val('');
		$('*[data-category="'+categoryName+'"]').css("background-color", "#77b3d4"); // Animation when add a category
		setTimeout(function(){  $('*[data-category="'+categoryName+'"]').css("background-color", "");}, 1000);
	}
});


Template.blogEditCategories.helpers({
	
	categories: function(){
		return Categories.find({blogId: this.blog._id}, {sort: { name: 1 }});  
	}
});