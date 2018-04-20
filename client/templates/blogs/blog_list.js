Template.blogList.onCreated(function() {

	Deps.autorun(function() { // Autorun to reactively update blog visited subscription
		if (typeof Cookie.get('blogsVisited') != "undefined") {
			var blogs = JSON.parse(Cookie.get('blogsVisited'));
			Meteor.subscribe('blogsVisited', blogs);
		}
	});
});


Template.blogList.events({

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
	'click .blog-list--shutdown': function(e, template) {
		e.preventDefault();

		var alert = confirm(TAPi18n.__('blog-list--shutdown-message'));
		if (alert) {
			Meteor.call('shutdownBox', function(error, result){
				if (error) {
					alert(TAPi18n.__('error-message')+error.message);
				}
				else {
					alert(TAPi18n.__('blog-list--shutdown-confirm'));
				}
			});
		}
	}  
});


Template.blogList.helpers({
	
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
	  	}
});


