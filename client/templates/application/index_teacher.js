Template.indexTeacher.onCreated(function() {

	Deps.autorun(function() { // Autorun to reactively update blog visited subscription
		if (typeof Cookie.get('blogsVisited') != "undefined") {
			var blogs = JSON.parse(Cookie.get('blogsVisited'));
			Meteor.subscribe('blogsVisited', blogs);
		}
	});
});


Template.indexTeacher.onRendered(function () {
	
	Session.set('errorMessage', ''); // hide error messages

	this.$('.login--input-username').focus();

	T9n.map(
		'fr', { // Localization mapping
			'User not found': TAPi18n.__('login--user-not-found'),
			'Incorrect password': TAPi18n.__('login--incorrect-password')
		},
		'en', {
			'User not found': TAPi18n.__('login--user-not-found'),
			'Incorrect password': TAPi18n.__('login--incorrect-password')			
		},
		'es', {
			'User not found': TAPi18n.__('login--user-not-found'),
			'Incorrect password': TAPi18n.__('login--incorrect-password')			
		},
		'de', {
			'User not found': TAPi18n.__('login--user-not-found'),
			'Incorrect password': TAPi18n.__('login--incorrect-password')			
		}
	);
});


Template.indexTeacher.events({

	'submit form.blog-list--code-link-form': function(e) {
		e.preventDefault();

		var code = $(e.target).find('[id=code]').val();

		if (code && code != "") {
			Meteor.call('getBlogId', code, function(error, result) {
				if (error) {
					alert(TAPi18n.__('error-message')+error.message);
				} else if (result != null) {
					var blogId = result;
					var blogsVisited = [];
					var cookie = Cookie.get('blogsVisited');
					if (typeof cookie == "undefined" || cookie == "") // Check if user has already visited blogs
						blogsVisited.push(blogId);
					else {
						blogsVisited = JSON.parse(Cookie.get('blogsVisited'));
						if (JSON.parse(Cookie.get('blogsVisited')).indexOf(blogId) == -1)
							blogsVisited.push(blogId);
					}
					Cookie.set('blogsVisited', JSON.stringify(blogsVisited), {expires: 30}); // Set a cookie to remember visited blogs
					Router.go('blogPage', {_id: blogId});
				}
				else if (result == null) {
					alert(TAPi18n.__('blog-list--blog-doesnt-exist-message'));
				}
			});
		}
	},
    'click .blog-list--button-code-link': function(e) {
    	e.preventDefault();

    	$('.blog-list--code-link-form').submit();
  	},
    'click .blog-list--delete-recent': function(e) {
		e.preventDefault();

		Cookie.remove('blogsVisited');
		$('.blog-list--visited-blogs').hide();
	},
	'click .blog-list--select-lang': function(e) {
		e.preventDefault();

		Session.setPersistent('lang',$(e.currentTarget).data('lang'));
	},
	'submit form': function(e) {

		e.preventDefault();
		Session.set('errorMessage', ''); // hide error messages
		var email = e.target.email.value;
		var password = e.target.password.value;

		if (email && password) {
			Meteor.loginWithPassword(email.trim(), password, function(err) {
				if(!err)
					Router.go('indexTeacher');
				else    
					Session.set('errorMessage', err.reason);
			});
		}
	},
	'click .login--button-submit': function(e) {
		e.preventDefault();
		$('#login--form').submit();
	},
	'click .login--send-mail-forgot-password': function(e) {
		e.preventDefault();
		var email = $('#email').val();
		Accounts.forgotPassword({email:email},function(err) {
			if(!err)
				alert(TAPi18n.__("login--send-mail-forgot-password",email));    
			else {
				alert(TAPi18n.__("login--send-mail-forgot-password-error"));
				console.log(TAPi18n.__("login--send-mail-forgot-password-error-log",err));
			}
		});
	}
});


Template.indexTeacher.helpers({
	
	ownBlogs: function() {
		return Blogs.find({userId:Meteor.userId()}, {sort: {submitted: -1}});
	},
	blogsVisited: function() {
		if (typeof Cookie.get('blogsVisited') != "undefined") {
			var blogs = JSON.parse(Cookie.get('blogsVisited'));
			return Blogs.find({'_id':{$in:blogs}});
		}
	},
	isBox: function() {
    	return (Meteor.settings.public.isBox === "true")
  	},
  	isLangSelected: function(lang) {
  		if (Session.get('lang')) {
	  		langSelected = Session.get('lang');
	  		langSelected = langSelected.split("-");
			langSelected = langSelected[0]; // Remove country code
			if (lang == langSelected)
	  			return 'selected';
	  		}
	},
	errorMessage: function() {
		return Session.get('errorMessage');
	},
	passwordRecovery: function() {
		if (Session.get('errorMessage') === 'Incorrect password')
			return true;
	}
});