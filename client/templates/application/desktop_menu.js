Template.desktopMenu.helpers({
	postCount: function() { // return the number of posts
		return Posts.find().count();
	},
	tags: function() {
		return Tags.find({}, {sort: {nRefs: -1}});
	},
	tagQuery: function() {
		return "tags="+this.name;
	},
	'selectedTagClass': function(){
		var tagId = this.name;
	    var selectedTag = Session.get('selectedTag');
	    if(tagId == selectedTag){
	        return "menu--tag-selected"
	    }
	}
});

  Template.desktopMenu.events({
  // Speedup focus on input for mobile devices
  'click .hum': function(e) {
Router.go(myURL)
  }
});