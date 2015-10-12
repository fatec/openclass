Template.desktopMenu.helpers({
	postCount: function() { // return the number of posts
		return Posts.find().count();
	},
	tags: function() {
		return Tags.find({}, {sort: {nRefs: -1}});
	},
	categories: function() {
		//return Categories.find({}, nRefs: { $gt: 0 }, {sort: {nRefs: -1}});
				return Categories.find({ nRefs: { $gt: 0 } }, {sort: {nRefs: -1}});

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
	},
	'selectedAllPostsClass': function(){
	    var sortPosts = Session.get('sortPosts');
	    if(sortPosts == "all"){
	        return "menu--link-sort-selected"
	    }
	},
	'selectedLastPostsClass': function(){
    	var sortPosts = Session.get('sortPosts');
    	if(sortPosts == "last"){
        	return "menu--link-sort-selected"
    	}
	},
	'selectedAuthorClass': function(){
		var authorName = this.name;
	    var selectedAuthor = Session.get('selectedAuthor');
	    if(authorName == selectedAuthor){
	        return "menu--authors-selected"
	    }
	},	
	authors: function() {
		return Authors.find({ nRefs: { $gt: 0 } }, {sort: {name: 1}});
	},
	authorQuery: function() {
		return "author="+this.name;
	},	
});

  Template.desktopMenu.events({
  'click .menu--link-last-posts': function(e) {
    Session.set("sortPosts", "last");    
  },
  'click .menu--link-all-posts': function(e) {
    Session.set("sortPosts", "all");    
  }  
});