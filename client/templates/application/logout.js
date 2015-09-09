Template.logout.events({
	'click .logout--button-confirm': function(e) {
		e.preventDefault();
    	Meteor.logout(); 
        Router.go('blogsList');
  	},
    'click .logout--button-cancel': function(e) {
    	e.preventDefault();
        Router.go('blogsList');
  	}
});