Template.blogUsers.events({
	'submit form': function(event, template) {
		event.preventDefault();

		var authorName = $('#authorName').val().trim();

		if (authorName != "") {
			if (Authors.findOne({name:authorName})) {
				if (confirm("L'utilisateur "+authorName+" existe déjà. Se connecter avec ce nom ?")) {
					Session.setPersistent(template.data.blog._id, {author: authorName}); // Persistent to browser refresh
					Router.go('blogPage', {_id: template.data.blog._id});
				}
				else
					return;
			}
			else {
				Meteor.call('authorInsert', authorName, template.data.blog._id, function(error) {
					if(error)
						alert("Une erreur est survenue : "+error.message);
					else {
						Session.setPersistent(template.data.blog._id, {author: authorName});
						Router.go('blogPage', {_id: template.data.blog._id});					
					} 
				});
			}
		}
	},
	'click .blog-users--button-submit-author': function(event, template) {
		event.preventDefault();
		$('#blog-users--form').submit();
	},
	'click .blog-users--button-select-author': function(event, template) {
		event.preventDefault();

		Session.setPersistent(this.blogId, {author: event.currentTarget.dataset.author});
		Router.go('blogPage', {_id: template.data.blog._id});
	}  
});


Template.blogUsers.helpers({

	authors: function(){
		return Authors.find({},{sort: { name: 1 }});  
	},
	createUserAllowed: function() {
		return this.blog.createUserAllowed;
	},
	optionIsSelected: function(authorName) {
		if (Session.get(Template.parentData().blog._id))
			return authorName === Session.get(Template.parentData().blog._id).author;
		else
			return null;
	}  
});