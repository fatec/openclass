Template.postsHeader.onRendered(function() {

	$('.open-popup-link').magnificPopup({
	  type:'inline',
	  closeOnContentClick: false,
	  closeOnBgClick: false,
	  midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
	  callbacks: {
    		open: function() {
      // Will fire when this exact popup is opened
      // this - is Magnific Popup object
    		},
    		close: function() {

    		// reset form	
    		$(".post-submit--textarea").val('');
    		$(".post-submit--select-categories").val('');

			if (Session.get("fileId")) {
				delete Session.keys["fileId"]; // Clear fileId session
			    Session.set("fileId",''); // needed to set to null to get it work, but don't know why...
			}

			if (Session.get("fileExt")) 
				delete Session.keys["fileExt"]; // Clear fileExt session
			    Session.set("fileExt",''); // needed to set to null to get it work, but don't know why...
    		}

    	}

	});
});

// Template.postsHeader.events({
	
// 	'click .posts-header--button-submit': function(e) {
// 		e.preventDefault();
// 		history.back();
//   	}
// });

Template.postsHeader.helpers({
	
	authorName: function() {
		if (Session.get(this.blog._id).author)
		return Session.get(this.blog._id).author; 
	},    
	submitAllowed: function() {
		if (this.blog.postEditPermissions !== undefined) {
			if (this.blog.postEditPermissions === "none" && Roles.userIsInRole(Meteor.userId(), ['admin']) != true && this.blog.userId != Meteor.userId())
				return false
			else
				return true
		}
		else 
			return true
	},
	ownBlog: function() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
		if (userId)
			if (this.blog.userId === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
	}
});