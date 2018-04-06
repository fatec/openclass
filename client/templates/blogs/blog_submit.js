Template.blogSubmit.onRendered(function() {

	this.$('.blog-submit--input').focus();
});


Template.blogSubmit.events({
	
	'submit form': function(e) {
		e.preventDefault();

		var blog = {
			title: $(e.target).find('[name=title]').val()
		};
		
		Meteor.call('blogInsert', blog, function(error, result) {
			if(error)
				alert(TAPi18n.__('error-message')+error.message);
			else {
				Router.go('blogPage', {_id: result._id});
			}       
		});
	},
	'click .blog-submit--button-submit': function(e) {
		e.preventDefault();
		$('#blog-submit--form').submit();
	},
	'click .blog-submit--button-cancel': function(e) {
		e.preventDefault();
		history.back();  
	}     
});