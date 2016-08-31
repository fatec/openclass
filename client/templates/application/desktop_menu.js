  function addClick(blogId,content) {

   var authorId = Authors.findOne({name: Session.get(blogId).author});
   console.log(authorId);
    Authors.update({ _id: authorId._id },{ $push: { clicks: content }})
  }

  
Template.desktopMenu.helpers({

	postCount: function() { // return the number of posts
		return this.posts.count();
	},
	tags: function() {
		return Tags.find({}, {sort: {name: 1}});
	},
	categories: function() {
		return Categories.find({ nRefs: { $gt: 0 } }, {sort: {name: 1}});
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
    	if (Session.get('filter'))
    		if (Session.get('filter') != '')
    			return false
    		else return "menu--link-sort-selected"
    	else return "menu--link-sort-selected"	
    	
	},
	'selectedFavoritesClass': function(){
    	if (Session.get('filter') === 'favorites')
    		return "menu--link-favorites-selected"
    	else return false;
    	
	},	
	authors: function() {
		return Authors.find({ nRefs: { $gt: 0 } }, {sort: {name: 1}});
	},
	authorQuery: function() {
		return "author="+this.name;
	}
});

  Template.desktopMenu.events({
  'click .menu--link-last-posts': function(e,template) {
    Session.set("filter", ""); 
    Session.set('posts',Posts.find({}, {sort: {nb: 1}}).fetch()); 
    Session.set("click", Session.get("click")+1);
    addClick(template.data.blog._id,"view all");
  },
    'click .menu--link-favorites': function(e,template) {
    Session.set("filter", "favorites"); 
    Session.set('posts',Posts.find({favorites: true}, {sort: {nb: 1}}).fetch()); 

    //Session.set('posts',Posts.find({favorites:1}, {sort: {nb: 1}}).fetch()); 
    Session.set("click", Session.get("click")+1);
    addClick(template.data.blog._id,"view favorites");
  },
  	  'click .filter-tag': function(e,template) {
    e.preventDefault();
    Session.set('filter','tag');
    var tag = $(e.target).data('tag');
    Session.set('tag',tag);
    Session.set('posts',Posts.find({tags: tag}, {sort: {nb: 1}}).fetch()); 
    Session.set("click", Session.get("click")+1);
    addClick(template.data.blog._id,"tag: "+tag);
  },
  'click .filter-author': function(e,template) {
    e.preventDefault();
    Session.set('filter','author');
    var author = $(e.target).data('author');
    Session.set('author',author);
    Session.set('posts',Posts.find({author: author}, {sort: {nb: 1}}).fetch()); 
    Session.set("click", Session.get("click")+1);
    addClick(template.data.blog._id,"author: "+author);
  },
  'click .filter-category': function(e,template) {
    e.preventDefault();
    Session.set('filter','category');
    var category = $(e.target).data('category');
    Session.set('category',category);
    Session.set('posts',Posts.find({category: category}, {sort: {nb: 1}}).fetch()); 
    Session.set("click", Session.get("click")+1);
    addClick(template.data.blog._id,"category: "+category);
  }  
});