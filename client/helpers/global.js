// Global helpers

// Check in settings.json if the server is a box or a web server
Template.registerHelper("isBox", function () {
    return (Meteor.settings.public.isBox === "true");
});

Meteor.startup(function () {
	});