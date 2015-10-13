Template.blogsList.helpers({
	blogs: function() {
		return Blogs.find();
	}
});


Template.blogsList.events({
	'submit form.blogs-list--code-link-form': function(e) {
		e.preventDefault();
		var code = $(e.target).find('[id=code]').val();
		console.log(Blogs.findOne(code));
		if (Blogs.findOne(code))
        	Router.go('blogPage', {_id: code});
		else
			alert("Ce journal n'existe pas.");
},
    'click .blogs-list--button-code-link': function(e) {
    e.preventDefault();
    $('.blogs-list--code-link-form').submit();
  },

});