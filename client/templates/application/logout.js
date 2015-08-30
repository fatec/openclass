Template.logout.events({
	'click .logout--button-confirm': function(e) {
		e.preventDefault();
    	Meteor.logout(); 
    	history.back();
  	},
    'click .logout--button-cancel': function(e) {
    	e.preventDefault();
    	history.back();  
  	}
});