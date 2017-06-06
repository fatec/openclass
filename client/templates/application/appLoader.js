// Inject HTML (spinner) before Meteor is loaded

if (Meteor.isServer) {
	Inject.rawHead("loader", Assets.getText('appLoader.html'));
}

if (Meteor.isClient) {
	Meteor.startup(function() {
		setTimeout(function() {
			$("#inject-loader-wrapper").fadeOut(500, function() { $(this).remove(); });
		}, 500);
	});
}