Template.desktopMenu.helpers({
	postCount: function() { // return the number of posts
		return Posts.find().count();
	},
	tags: function() {
		return Tags.find({}, {sort: {nRefs: -1}});
	},
	tagQuery: function() {
		return "sort_posts="+Router.current().params.query.sort_posts+"&tags="+this.name;
		//return "tags="+this.name;
	},
	'selectedTagClass': function(){
		var tagId = this.name;
	    var selectedTag = Session.get('selectedTag');
	    if(tagId == selectedTag){
	        return "menu--tag-selected"
	    }
	},
	'selectedAllPostsClass': function(){
	    var sortPosts = Session.get('sortPosts');
	    if(sortPosts != "last"){
	        return "menu--link-sort-selected"
	    }
	},
	'selectedLastPostsClass': function(){
    	var sortPosts = Session.get('sortPosts');
    	if(sortPosts == "last"){
        	return "menu--link-sort-selected"
    	}
	} 
});

  Template.desktopMenu.events({
  // Speedup focus on input for mobile devices
  'click .hum': function(e) {
Router.go(myURL)
  }
});