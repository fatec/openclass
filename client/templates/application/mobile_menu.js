Template.slideoutMenu.helpers({

	postCount: function() { // return the number of posts
		if (this.posts)
			return this.posts.count();
	},
	authors: function() {
		return Authors.find({}, {sort: {name: 1}});
	},
	authorNRef: function() {
		return Posts.find({author:this.name}).fetch().length;
	},
	tags: function() {
		return Tags.find({}, {sort: {name: 1}});
	},
	tagsNRef: function() {
		return Posts.find({tags:{$in : [this.name]}}).fetch().length;
	},
	categories: function() {
		return Categories.find({}, {sort: {name: 1}});
	},	
	categoriesNRef: function() {
		return Posts.find({category:this.name}).fetch().length;
	},
	'selectedAuthorClass': function(){
		if (this.name == Session.get('author'))
			return "slideout-menu--list-element-selected"
	},
	'selectedTagClass': function(){
		if (this.name == Session.get('tag'))
			return "slideout-menu--list-element-selected"
	},
	'selectedCategoryClass': function(){
		if (this.name == Session.get('category'))
			return "slideout-menu--list-element-selected"
	},	
	'selectedShowAll': function() {
		if (Session.get('author') == '' && Session.get('category') == '' && Session.get('tag') == '')
			return "slideout-menu--list-element-selected"	
	},	
	'isDisabled': function(nRef) {
		if (nRef == 0)
			return "slideout-menu--list-element-disabled"
		else return null
	},
	ownBlog: function() {
		if (this.blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)    		return true;
  	},   	
	// favoritesCount: function() {
	// 	return Posts.find({favorites: true}).fetch().length;
	// },	
	// 'selectedFavoritesClass': function(){
	// 	if (Session.get('filter') === 'favorites')
	// 		return "mobile-menu--list-element-selected"
	// 	else return false;
	// },
});

Template.slideoutMenu.events({

	'click .slideout-menu--link-show-all': function(e) {
	Session.set("filter", ""); 
	Session.set('nbPosts',Posts.find({}).fetch().length); 
	},
	'click .slideout-menu--exit': function(e){
		e.preventDefault();
		Router.go('blogsList');
	},
	'click .slideout-menu--settings': function(e,template){
		e.preventDefault();
		Router.go('blogEdit',{_id: template.data.blog._id});
	},
	'click .desktop-menu--show-all': function(e) {
		e.preventDefault();
		Session.set("author",'');
		Session.set("tag",''); 
		Session.set("category",''); 
		Session.set('nbPosts',Posts.find({}).fetch().length); 
	},
	'click .filter-tag': function(e) {
		e.preventDefault();
		var tag = $(e.target).data('tag');
		Session.set("author",'');
		Session.set("tag",''); 
		Session.set("category",''); 
		Session.set('tag',tag);
		Session.set('nbPosts',Posts.find({tags: tag}).fetch().length); 
	},
	'click .filter-author': function(e) {
		e.preventDefault();
		var author = $(e.target).data('author');
		Session.set("author",'');
		Session.set("tag",''); 
		Session.set("category",'');
		Session.set('author',author);
		Session.set('nbPosts',Posts.find({author: author}).fetch().length); 
	},
	'click .filter-category': function(e) {
		e.preventDefault();
		var category = $(e.target).data('category');
		Session.set('category',category);
		Session.set("author",'');
		Session.set("tag",''); 
		Session.set("category",'');
		Session.set('category',category);
		Session.set('nbPosts',Posts.find({category: category}).fetch().length); 
	} 
	// 'click .menu--link-favorites': function(e,template) {
	// Session.set("filter", "favorites"); 
	// Session.set('nbPosts',Posts.find({favorites: true}).fetch().length); 
	// },
});