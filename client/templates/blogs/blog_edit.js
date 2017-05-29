Template.blogEdit.events({
 
	'click .blog-edit--rename-button': function(e) {
		e.preventDefault();

		var currentBlogId = this.blog._id;
		var newName = prompt("Renommer cet espace :", this.blog.title);
		if (newName) {
			var blogProperties = {
				title: newName
			}
			Blogs.update(currentBlogId, {$set: blogProperties}, function(error) {
				if (error)
				{
					alert("Une erreur est survenue : "+error.message);
				}
				else {
					alert("Le journal s'appelle désormais : "+newName);
				}
			});
		}
	},
	'click .blog-edit--delete-button': function(e) {
		e.preventDefault();

		if (confirm("Effacer définitivement cet espace et son contenu ?")) {
			Meteor.call('deleteBlog', this.blog._id, function(error) {
				if (error)
					alert("Une erreur est survenue : "+error.message);
				else {
					alert("Le blog a bien été supprimé");
					Router.go('blogList');
				}
			});
		}
	},
	'click .blog-edit--activate-reactiveness': function(e) {
		e.preventDefault();

		if (Session.get('isReactive'))
			Session.set('isReactive',false);
		else
			Session.set('isReactive',true);
	},
	'click .blog-edit--activate-comments': function(e) {
		e.preventDefault();
	
		if (this.blog.commentsAllowed)
			Blogs.update(this.blog._id, {$set: {commentsAllowed:false}}, function(error) {
				if (error)
					alert("Une erreur est survenue : "+error.message);
			});
		else
			Blogs.update(this.blog._id, {$set: {commentsAllowed:true}}, function(error) {
				if (error)
					alert("Une erreur est survenue : "+error.message);
			});
	},
	'click .blog-edit--activate-create-user': function(e) {
		e.preventDefault();

		if (this.blog.createUserAllowed)
			Blogs.update(this.blog._id, {$set: {createUserAllowed:false}}, function(error) {
				if (error)
					alert("Une erreur est survenue : "+error.message);
			});
		else
			Blogs.update(this.blog._id, {$set: {createUserAllowed:true}}, function(error) {
				if (error)
					alert("Une erreur est survenue : "+error.message);
			});
	},
	'change .blog-edit--select-permissions': function(event) {
		event.preventDefault();
		Blogs.update(this.blog._id, {$set: {postEditPermissions:event.target.value}}, function(error) {
			if (error)
				alert("Une erreur est survenue : "+error.message);
		});
	}, 
	'click .blog-edit--change-password': function(e) { // Change user password
		e.preventDefault();

		var oldPassword = prompt("Mot de passe actuel :");
		if (oldPassword) 
			var newPassword = prompt("Nouveau mot de passe :");
		if (newPassword)
			Accounts.changePassword(oldPassword, newPassword, function(error) {
				if (error)
					alert("Une erreur est survenue : "+error.message);
				else
					alert("Votre mot de passe a été changé.");
			});
	},
	'click .blog-edit--sync': function(e, template) {
		e.preventDefault();
		Session.set('isSyncing',true);
		var serverOwnerEmail = prompt("Utilisateur :"); //

		if (serverOwnerEmail)
			Meteor.call('sendBlog', {blogId: this.blog._id, serverOwner: serverOwnerEmail}, function(error,result) {
				if (error)
					alert("Un problème est survenu. Vérifiez que la box est bien connectée à internet et recommencez.");
			});
		},
	'click .blog-edit--update': function(e, template) {
		e.preventDefault();

		Meteor.call('updateBox', function(error, result){
			if (error) {
				alert("Une erreur est survenue : "+error.message);
			}
			else {
				alert("La box est en train d'être mise à jour...");
			}
		});
	}  
}); 


Template.blogEdit.helpers({

	serverIP: function() {
		Meteor.call('getIP', function(error, result){
			if (error) {
				Session.set('serverIP',"Pas d'adresse IP"); // Is Session really usefull here ?
			} else{
				Session.set('serverIP',result);
			}
		});
		return Session.get('serverIP');
	},
	isSyncing: function() {
		return Session.get('isSyncing');
	},
	isBox: function() {
		return (Meteor.settings.public.isBox === "true")
	},
	isReactive: function() {
		return Session.get('isReactive')
	},
	commentsAreAllowed: function() {
		return this.blog.commentsAllowed
	},
	createUserIsAllowed: function() {
		return this.blog.createUserAllowed
	},
	permissionIsSelected: function(value) {
		return (this.blog.postEditPermissions === value)
	}
});
