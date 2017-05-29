Template.slideoutMenu.events({

	'click .slideout-menu--exit': function(e){
		e.preventDefault();
		Router.go('blogList');
	},
	'click .slideout-menu--settings': function(e,template){
		e.preventDefault();
		Router.go('blogEdit',{_id: template.data.blog._id});
	},
	'click .slideout-menu--show-all': function(e) {
		e.preventDefault();
		resetFilters();
		Session.set('postsServerNonReactive', Counts.findOne().count);
		resetPostInterval();
	},
	'click .filter-author': function(e) {
		e.preventDefault();
		var author = $(e.target).data('author');
		resetFilters();
		Session.set('author',author);
		Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		resetPostInterval();
		},
	'click .filter-category': function(e) {
		e.preventDefault();
		var category = $(e.target).data('category');
		resetFilters();
		Session.set('category',category);
		Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		resetPostInterval();
	}, 	
	'click .filter-tag': function(e) {
		e.preventDefault();
		var tag = $(e.target).data('tag');
		resetFilters();
		Session.set('tag',tag);
		Session.set('postsServerNonReactive', Tags.findOne({name:tag}).nRefs);
		resetPostInterval();
	},
	// 'click .menu--link-favorites': function(e,template) {
	// Session.set("filter", "favorites"); 
	// Session.set('nbPosts',Posts.find({favorites: true}).fetch().length); 
	// },
});


Template.slideoutMenu.helpers({

	postCount: function() {
		var count = Counts.findOne();
		return count && count.count;
	},
	authorNRef: function() {
		var author = Authors.findOne({name:this.name});
		return author && author.nRefs;
	},
	categoriesNRef: function() {
		var category = Categories.findOne({name:this.name});
		return category && category.nRefs;
	},
	tagsNRef: function() {
		var tag = Tags.findOne({name:this.name});
		return tag && tag.nRefs;
	},
	authors: function() {
		return Authors.find({}, {sort: {name: 1}});
	},
	categories: function() {
		return Categories.find({}, {sort: {name: 1}});
	},
	tags: function() {
		return Tags.find({}, {sort: {name: 1}});
	},	
	'selectedShowAll': function() {
		if (Session.get('author') == '' && Session.get('category') == '' && Session.get('tag') == '')
			return "slideout-menu--list-element-selected"	
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
	'isDisabled': function(nRef) {
		if (nRef == 0)
			return "slideout-menu--list-element-disabled"
		else return null
	},
	ownBlog: function() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
		if (userId && this.blog)
			if (this.blog.userId === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
	},
	// ownBlog: function() {
	// 	if (this.blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true) 
	// 		return true;
	// },   	
	// favoritesCount: function() {
	// 	return Posts.find({favorites: true}).fetch().length;
	// },	
	// 'selectedFavoritesClass': function(){
	// 	if (Session.get('filter') === 'favorites')
	// 		return "mobile-menu--list-element-selected"
	// 	else return false;
	// },
});