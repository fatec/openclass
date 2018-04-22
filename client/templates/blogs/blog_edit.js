Template.blogEdit.events({
 
	'click .blog-edit--change-code-button': function(e) {
		e.preventDefault();

		var currentBlogId = this.blog._id;
		var currentBlogCode = this.blog.blogCode
		var newCode = prompt(TAPi18n.__('blog-edit--change-code-message')+" :", currentBlogCode);
		if (newCode && newCode != currentBlogCode) {
			Meteor.call('getBlogId', newCode, function(error,result) {
				if (error) {
					alert(TAPi18n.__('error-message')+error.message);
				}
				else {
					if (result == null) {
						var blogProperties = { blogCode: newCode }
						Blogs.update(currentBlogId, {$set: blogProperties}, function(error) {
							if (error)
							{
								alert(TAPi18n.__('error-message')+error.message);
							}
							else {
								alert(TAPi18n.__('blog-edit--change-code-confirm-message'));
								Meteor.call('updateCode', currentBlogCode, newCode)
							}
						});
					}
					else {
						alert(TAPi18n.__('blog-edit--change-code-already-used-message'));
					}
				}
			});
		}
	},
	'click .blog-edit--rename-button': function(e) {
		e.preventDefault();

		var currentBlogId = this.blog._id;
		var newName = prompt(TAPi18n.__('blog-edit--rename-blog-message')+" :", this.blog.title);
		if (newName) {
			var blogProperties = {
				title: newName
			}
			Blogs.update(currentBlogId, {$set: blogProperties}, function(error) {
				if (error)
				{
					alert(TAPi18n.__('error-message')+error.message);
				}
				else {
					alert(TAPi18n.__('blog-edit--rename-blog-confirm-message')+" : "+newName);
				}
			});
		}
	},
	'click .blog-edit--delete-button': function(e) {
		e.preventDefault();

		if (confirm(TAPi18n.__('blog-edit--delete-blog-message'))) {
			Meteor.call('deleteBlog', this.blog._id, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else {
					alert(TAPi18n.__('blog-edit--delete-blog-confirm-message'));
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
					alert(TAPi18n.__('error-message')+error.message);
			});
		else
			Blogs.update(this.blog._id, {$set: {commentsAllowed:true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	},
	'click .blog-edit--activate-create-user': function(e) {
		e.preventDefault();

		if (this.blog.createUserAllowed)
			Blogs.update(this.blog._id, {$set: {createUserAllowed:false}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
		else
			Blogs.update(this.blog._id, {$set: {createUserAllowed:true}}, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
			});
	},
	'change .blog-edit--select-permissions': function(event) {
		event.preventDefault();
		Blogs.update(this.blog._id, {$set: {postEditPermissions:event.target.value}}, function(error) {
			if (error)
					alert(TAPi18n.__('error-message')+error.message);
		});
	}, 
	'click .blog-edit--change-password': function(e) { // Change user password
		e.preventDefault();

		var oldPassword = prompt(TAPi18n.__('blog-edit--change-password-old-message'));
		if (oldPassword) 
			var newPassword = prompt(TAPi18n.__('blog-edit--change-password-new-message'));
		if (newPassword)
			Accounts.changePassword(oldPassword, newPassword, function(error) {
				if (error)
					alert(TAPi18n.__('error-message')+error.message);
				else
					alert(TAPi18n.__('blog-edit--change-password-confirm-message'));
			});
	},
	'click .blog-edit--sync': function(e, template) {
		e.preventDefault();
		Session.set('isSyncing',true);
		var serverOwnerEmail = prompt(TAPi18n.__('blog-edit--sync-login-message'));

		if (serverOwnerEmail)
			Meteor.call('sendBlog', {blogId: this.blog._id, serverOwner: serverOwnerEmail}, function(error,result) {
				if (error)
					alert(TAPi18n.__('blog-edit--sync-error-message'));
			});
		},
	'click .blog-edit--update': function(e, template) {
		e.preventDefault();

		Router.go('update');
	} 
}); 


Template.blogEdit.helpers({

	serverIP: function() {
		Meteor.call('getIP', function(error, result){
			if (error) {
				Session.set('serverIP',TAPi18n.__('blog-edit--no-ip')); // Is Session really usefull here ?
			} else {
				if (result != "")
					Session.set('serverIP',result);
				else
					Session.set('serverIP',TAPi18n.__('blog-edit--not-connected'));
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
