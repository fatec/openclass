Template.postSubmitHeader.events({
	
	'click .header--button-back': function(e) {
		e.preventDefault();
		history.back();
  	}
});


Template.postSubmitHeader.helpers({

	authorName: function() {
		return Session.get(this.blog._id).author; 
	}
});