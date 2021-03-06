Template.blogEdit.events({
 
	'click .blog-edit--change-code-button': function(e) {
		e.preventDefault();

		var currentBlogId = this.blog._id;
		var currentBlogCode = this.blog.blogCode
		var newCode = prompt("Chander le code d'accès :", currentBlogCode);
		if (newCode && newCode != currentBlogCode) {
			Meteor.call('getBlogId', newCode, function(error,result) {
				if (error) {
					alert("Une erreur est survenue : "+error.message);
				}
				else {
					if (result == null) {
						var blogProperties = { blogCode: newCode }
						Blogs.update(currentBlogId, {$set: blogProperties}, function(error) {
							if (error)
							{
								alert("Une erreur est survenue : "+error.message);
							}
							else {
								alert("Le code d'accès a été changé.");
								Meteor.call('updateCode', currentBlogCode, newCode)
							}
						});
					}
					else {
						alert("Ce code est déjà attribué à un autre espace.");
					}
				}
			});
		}
	},
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
		var serverOwnerEmail = prompt("Pour synchroniser cet espace avec le cloud, vous devez posséder un compte sur www.beekee.ch.\nSi c'est le cas, entrez le nom d'utilisateur de votre compte :"); //

		if (serverOwnerEmail)
			Meteor.call('sendBlog', {blogId: this.blog._id, serverOwner: serverOwnerEmail}, function(error,result) {
				if (error)
					alert("Un problème est survenu. Vérifiez que la box est bien connectée à internet et recommencez.");
			});
		},
	'click .blog-edit--update': function(e, template) {
		e.preventDefault();

		var alert = confirm("La mise à jour de la box peut rendre la plateforme inaccessible pendant plusieurs minutes.\nVoulez-vous continuer ?");
		if (alert) {
			Meteor.call('updateBox', function(error, result){
				if (error) {
					alert("Une erreur est survenue : "+error.message);
				}
				else {
					alert("La box va être mise à jour, merci de patienter...");
				}
			});
		}
	}  
}); 


Template.blogEdit.helpers({

	serverIP: function() {
		Meteor.call('getIP', function(error, result){
			if (error) {
				Session.set('serverIP',"Pas d'adresse IP"); // Is Session really usefull here ?
			} else {
				if (result != "")
					Session.set('serverIP',result);
				else
					Session.set('serverIP',"Non connectée");
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
