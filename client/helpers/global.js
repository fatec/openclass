// Global helpers

// Check in settings.json if the server is a box or a web server
Template.registerHelper("isBox", function () {
    return (Meteor.settings.public.isBox === "true");
});

Meteor.startup(function () {
	});


resetPostInterval = function() { // Reset interval of post subscription
	if (Session.get('postsServerNonReactive') > 10) {
		Session.set('postsToSkip',Session.get('postsServerNonReactive') - 10);
		Session.set('postsLimit',10);
	}
	else {
		Session.set('postsToSkip',0);
		Session.set('postsLimit',Session.get('postsServerNonReactive'));
	}
}

resetFilters = function() {
	Session.set('author','');
	Session.set('tag','');
	Session.set('category','');
}