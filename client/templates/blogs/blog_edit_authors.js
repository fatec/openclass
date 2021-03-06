
Template.blogEditAuthors.events({

	'click .blog-edit-authors--button-delete-author': function(event, template) {
		var currentBlogId = template.data.blog._id;
		var authorName = $(event.target).data("delete-author");
		var author = Authors.findOne({name: authorName, blogId: currentBlogId});
		if(confirm("Supprimer l'auteur "+authorName+" ?"))
			Authors.remove(author._id, function(error) {
				if (error)
					alert("Une erreur est survenue : "+error.message);
		});
	},
	'click .blog-edit-authors--button-edit-author': function(event, template) {
		var currentBlogId = template.data.blog._id;
		var oldName = $(event.target).data("edit-author");
		var newName = prompt("Modifier l'auteur :",oldName);
		Meteor.call('authorEdit', currentBlogId, oldName, newName, function(error) {
			if (error)
				alert("Une erreur est survenue : "+error.message);
		});
	},
	'submit form.blog-edit--form-add-author': function(e) {
		e.preventDefault();
		var currentBlogId = this.blog._id;
		var authorName = $('#authorName').val().trim();
		if (authorName != "")
		{
			if (Authors.findOne({blogId: this.blog._id, name:authorName}))
				alert("Il y a déjà un auteur avec ce nom.");
			else {
				Meteor.call('authorInsert', authorName, this.blog._id, function(error) {
					if (error)
						alert("Une erreur est survenue : "+error.message);
				});
				$('#authorName').val('');
				$('*[data-author="'+authorName+'"]').css("background-color", "#77b3d4");  // Animation when add a category
				setTimeout(function(){  $('*[data-author="'+authorName+'"]').css("background-color", "");}, 1000);
			}
		}
	}
});


Template.blogEditAuthors.helpers({
	
	authors: function(){
		return Authors.find({blogId: this.blog._id},{sort: { name: 1 }});  
	},
	guest: function(){ // Guest cannot be deleted
		return this.name === 'Invité';
	}
});