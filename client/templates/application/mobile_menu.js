function resetPostInterval() { // Reset interval of post subscription
	if (Session.get('postsServerNonReactive') > 10) {
		Session.set('postsToSkip',Session.get('postsServerNonReactive') - 10);
		Session.set('postsLimit',10);
	}
	else {
		Session.set('postsToSkip',0);
		Session.set('postsLimit',Session.get('postsServerNonReactive'));
	}
}


Template.slideoutMenu.helpers({

	postCount: function() {
		return Counts.findOne().count;
	},
	authorNRef: function() {
		return Authors.findOne({name:this.name}).nRefs;
	},
	categoriesNRef: function() {
		return Category.findOne({name:this.name}).nRefs;
	},
	tagsNRef: function() {
		return Tags.findOne({name:this.name}).nRefs;
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
		if (this.blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true) 
			return true;
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

	'click .slideout-menu--exit': function(e){
		e.preventDefault();
		Router.go('blogsList');
	},
	'click .slideout-menu--settings': function(e,template){
		e.preventDefault();
		Router.go('blogEdit',{_id: template.data.blog._id});
	},
	'click .slideout-menu--show-all': function(e) {
		e.preventDefault();
		Session.set("author",'');
		Session.set("tag",''); 
		Session.set("category",''); 
		Session.set('postsServerNonReactive', Counts.findOne().count);
		resetPostInterval();
	},
	'click .filter-author': function(e) {
		e.preventDefault();
		var author = $(e.target).data('author');
		Session.set("tag",''); 
		Session.set("category",'');
		Session.set('author',author);
		Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		resetPostInterval();
		},
	'click .filter-category': function(e) {
		e.preventDefault();
		var category = $(e.target).data('category');
		Session.set("author",'');
		Session.set("tag",''); 
		Session.set('category',category);
		Session.set('postsServerNonReactive', Category.findOne({name:category}).nRefs);
		resetPostInterval();
	}, 	
	'click .filter-tag': function(e) {
		e.preventDefault();
		var tag = $(e.target).data('tag');
		Session.set("author",'');
		Session.set("category",''); 
		Session.set('tag',tag);
		Session.set('postsServerNonReactive', Tags.findOne({name:tag}).nRefs);
		resetPostInterval();
	},
	// 'click .menu--link-favorites': function(e,template) {
	// Session.set("filter", "favorites"); 
	// Session.set('nbPosts',Posts.find({favorites: true}).fetch().length); 
	// },
});