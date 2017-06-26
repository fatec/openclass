if (Meteor.isServer) {
	Inject.meta("metaLoader", '<meta name="viewport" content="initial-scale=1.0, user-scalable=0, width=device-width, height=device-height"/>');
	Inject.rawHead("htmlLoader", Assets.getText('appLoader.html'));
}

if (Meteor.isClient) {
	Meteor.startup(function() {
		setTimeout(function() {
			$("#inject-loader-wrapper").fadeOut(500, function() { $(this).remove(); });
		}, 500);
	});
}