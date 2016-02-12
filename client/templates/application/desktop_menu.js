Template.desktopMenu.helpers({
	postCount: function() { // return the number of posts
		return Session.get('posts').length;
	},
	tags: function() {
		return Tags.find({}, {sort: {nRefs: -1}});
	},
	categories: function() {
		return Categories.find({ nRefs: { $gt: 0 } }, {sort: {nRefs: -1}});
	},	
	tagQuery: function() {
		return "tags="+this.name;
	},
	categoryQuery: function() {
		return "category="+this.name;
	},	
	'selectedTagClass': function(){
		var tagId = this.name;
	    if (Session.get('filter') === 'tag')
	    {
	      var selectedTag = Session.get('tag');
	      if(tagId == selectedTag){
	        return "menu--tag-selected"
	      }
    	}
	},
	'selectedCategoryClass': function(){
		var categoryId = this.name;
		if (Session.get('filter') === 'category')
	    {
	      var selectedCategory = Session.get('category');
	      if(categoryId == selectedCategory){
	        return "menu--author-selected"
	      }
    	}
	},	
	'selectedAuthorClass': function(){
		var authorId = this.name;
		if (Session.get('filter') === 'author')
	    {
	      var selectedAuthor = Session.get('author');
	      if(authorId == selectedAuthor){
	        return "menu--author-selected"
	      }
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
    	if(sortPosts == "last" && !Router.current().params.query.tags && !Router.current().params.query.author && !Router.current().params.query.category){
        	return "menu--link-sort-selected"
    	}
	},	
	authors: function() {
		return Authors.find({ nRefs: { $gt: 0 } }, {sort: {name: 1}});
	},
	authorQuery: function() {
		return "author="+this.name;
	},	
	isReactive: function() {
		return Session.get('isReactive');
    }
});

  Template.desktopMenu.events({
  'click .menu--link-last-posts': function(e) {
    Session.set("filter", ""); 
        Session.set('posts',Posts.find({}, {sort: {nb: -1}}).fetch()); 

  }
});