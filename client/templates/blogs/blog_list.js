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

		Meteor.call('getBlogId', code, function(error, result) {
			if (error) {
				alert("Cet espace n'existe pas.\nAssurez-vous de respecter les majuscules et les minuscules.");
			} else {
				console.log("ON a le blog ID :"+result);
				var blogId = result;
				var blogsVisited = [];
				var cookie = Cookie.get('blogsVisited');
				if (typeof cookie == "undefined" || cookie == "") // Check if user has already visited blogs
					blogsVisited.push(blogId);
				else
				{
					blogsVisited = JSON.parse(Cookie.get('blogsVisited'));
					if (JSON.parse(Cookie.get('blogsVisited')).indexOf(blogId) == -1)
						blogsVisited.push(blogId);
				}
				Cookie.set('blogsVisited', JSON.stringify(blogsVisited), {expires: 30}); // Set a cookie to remember visited blogs
				Router.go('blogPage', {_id: blogId});
			}
		});
	},
    'click .blog-list--button-code-link': function(e) {
    	e.preventDefault();

    	$('.blog-list--code-link-form').submit();
  	},
    'click .blog-list--delete-recent': function(e) {
		e.preventDefault();

		Cookie.remove('blogsVisited');
		$('.blog-list--visited-blogs').hide();
	}
});


Template.blogList.helpers({
	ownBlogs: function() {
		return Blogs.find({userId:Meteor.userId()}, {sort: {submitted: -1}});
	},
	blogsVisited: function() {
		if (typeof Cookie.get('blogsVisited') != "undefined")
			var blogs = JSON.parse(Cookie.get('blogsVisited'));
			return Blogs.find({'_id':{$in:blogs}});
	},
	isBox: function() {
    	return (Meteor.settings.public.isBox === "true")
  	}
});


