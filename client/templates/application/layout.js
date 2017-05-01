Template.layout.onRendered(function () {

	// Slideout (lateral menu)
	var template = this;
	slideout = new Slideout({
		'panel': template.$('#content').get(0),
		'menu': template.$('#slideout-menu').get(0),
		'padding': 256,
		'tolerance': 70,
		'touch': false
	});

	function closeMenu(event) {
		event.preventDefault();
		slideout.close();
		event.stopPropagation(); // Prevent click propagation to menu wrapper button
	}

	// Close lateral menu on click
	slideout
	.on('beforeopen', function() {
		this.panel.classList.add('panel-open');
	})
	.on('open', function() {
		this.panel.addEventListener('click', closeMenu);
	})
	.on('beforeclose', function() {
		this.panel.classList.remove('panel-open');
		this.panel.removeEventListener('click', closeMenu);
	});

	T9n.setLanguage("fr");

Meteor.autorun(function () {
    var stat;
    if (Meteor.status().status === "connected") {
        stat = 1;
    }
    else if (Meteor.status().status === "connecting") {
        stat = 0;
    }
    else {
        stat = 0;
    }
    Session.set('status',stat);
});

});


Template.layout.events({
	
	'touchend input': function(e) { // Speedup focus on input for mobile devices
		$(e.target).focus();
	},
	'touchend textarea': function(e) {
		$(e.target).focus();
	},  
	'click .header--button-menu-wrapper': function(e) {
		e.preventDefault();
		slideout.toggle();
	}
});

Template.layout.helpers({
	
	isAdmin: function() {
		if (Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
			return true;
	},
	status: function() {
		console.log(Session.get('status'));
		if (!Session.get('status'))
			return 'layout--status-disconnected'
		else
			return 'layout--status-connected'
	},
	 isBox: function() { // Check if Meteor is running under a beekee box
    return (Meteor.settings.public.isBox === "true")
  },
});