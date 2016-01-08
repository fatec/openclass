Template.blogsList.helpers({
	blogs: function() {
		return Blogs.find({}, {sort: {submitted: -1}});
	},
		ownBlog: function() {
		if (this.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
    		return true;
  	},
  	blogsVisitedCount: function() {
  		if (typeof Session.get("blogsVisited") != "undefined")
  			return true;
  	},
	blogsVisited: function() {
		var blogs = Session.get("blogsVisited");
		console.log(blogs);
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

			// Save recent blogs
			if (typeof blogsVisited == "undefined")
				blogsVisited = [];
			if ($.inArray( blogId, blogsVisited ) == '-1')
				blogsVisited.push(blogId);
        	Session.set("blogsVisited",blogsVisited);

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