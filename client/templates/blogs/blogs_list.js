Template.blogsList.helpers({
	blogs: function() {
		return Blogs.find();
	}
});


Template.blogsList.events({
	'submit form.blogs-list--code-link-form': function(e) {
		e.preventDefault();
		var code = $(e.target).find('[id=code]').val();

		var owner = code.substr(0,code.indexOf('/')); // "72"
		var blogTitle = code.substr(code.indexOf('/')+1); // "tocirah sneab"

		if (Blogs.findOne({author:owner, title:blogTitle}))
        	Router.go('blogPage', {_id: Blogs.findOne({author:owner, title:blogTitle})._id});
		else
			alert("Ce journal n'existe pas.");
},
    'click .blogs-list--button-code-link': function(e) {
    e.preventDefault();
    $('.blogs-list--code-link-form').submit();
  },

});


Template.blogsList.rendered = function(){

  this.$('#code').focus();

  }