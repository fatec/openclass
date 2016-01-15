Template.blogsList.helpers({
	blogs: function() {
		return Blogs.find({}, {sort: {submitted: -1}});
	},
		ownBlog: function() {
		if (this.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
    		return true;
  	},
  	blogsVisitedCount: function() {
  		if (typeof Cookie.get('blogsVisited') != "undefined")
  			return true;
  	},
	blogsVisited: function() {
		var blogs = JSON.parse(Cookie.get('blogsVisited'));
		return Blogs.find({'_id':{$in:blogs}});
	}
});


Template.blogsList.events({
	'submit form.blogs-list--code-link-form': function(e) {
		e.preventDefault();
		var code = $(e.target).find('[id=code]').val();

		var owner = code.substr(0,code.indexOf('/')); // "72"
		var blogTitle = code.substr(code.indexOf('/')+1); // "tocirah sneab"

		if (Blogs.findOne({blogCode:code}))
		{
			var blogId = Blogs.findOne({blogCode:code})._id;

			var blogsVisited = [];
			var cookie = Cookie.get('blogsVisited');
			console.log(typeof cookie);
			if (typeof cookie == "undefined")
				blogsVisited.push(blogId);
			else
			{
				blogsVisited = JSON.parse(Cookie.get('blogsVisited'));
				console.log(typeof blogsVisited)
				if (JSON.parse(Cookie.get('blogsVisited')).indexOf(blogId) == -1)
					blogsVisited.push(blogId);
			}
			Cookie.set('blogsVisited', JSON.stringify(blogsVisited), {expires: 30});			
			// if (typeof Cookie.get('blogsVisited') == "undefined")
			// 	blogsVisited.push(blogId);
			// else
			// blogsVisited = Cookie.get('blogsVisited');
			console.log(Cookie.get('blogsVisited'));
			//blogsVisited.push(blogId);
			//Cookie.set('blogsVisited', blogsVisited);

			// Save recent blogs
			// if (typeof blogsVisited == "undefined")
			// 	blogsVisited = [];
			// if ($.inArray( blogId, blogsVisited ) == '-1')
			// 	blogsVisited.push(blogId);
			// Cookie.set('foo', 3);
   //      	Session.set("blogsVisited",blogsVisited);

            Router.go('blogPage', {_id: blogId});
		}
		else
			alert("Cet espace n'existe pas.");
},
    'click .blogs-list--button-code-link': function(e) {
    e.preventDefault();
    $('.blogs-list--code-link-form').submit();
  },

});


Template.blogsList.rendered = function(){

	//blogsVisited = [];

  //this.$('#code').focus();

  }