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

		if (Blogs.findOne({blogCode:code}))
		{
			var blogId = Blogs.findOne({blogCode:code})._id;
        	Router.go('blogPage', {_id: blogId});
        	if (Meteor.user())
        	{
        		Blogs.update({_id:blogId},{$push:{memberUserEmail: Meteor.user().emails[0].address}});
        	}
        }
		else
			alert("Ce journal n'existe pas.");
},
    'click .blogs-list--button-code-link': function(e) {
    e.preventDefault();
    $('.blogs-list--code-link-form').submit();
  },

});


Template.blogsList.rendered = function(){

  //this.$('#code').focus();

  }