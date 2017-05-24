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

Template.desktopMenu.helpers({

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
			return "desktop-menu--list-element-selected"	
	},
	'selectedAuthorClass': function(){
		if (this.name == Session.get('author'))
			return "desktop-menu--list-element-selected"
	},
	'selectedTagClass': function(){
		if (this.name == Session.get('tag'))
			return "desktop-menu--list-element-selected"
	},
	'selectedCategoryClass': function(){
		if (this.name == Session.get('category'))
			return "desktop-menu--list-element-selected"
	},
	'isDisabled': function(nRef) {
		if (nRef == 0)
			return "desktop-menu--list-element-disabled"
		else return null
	}
	// 	'selectedFavoritesClass': function(){
	// 		if (Session.get('filter') === 'favorites')
	// 			return "desktop-menu--list-element-selected"
	// 		else return false;
	// },	
	// favoritesCount: function(){
	// 	return Posts.find({favorites: true}).fetch().length;
	// },
});

Template.desktopMenu.events({
	
	'click .desktop-menu--show-all': function(e) {
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
	// 'click .desktop-menu--link-favorites': function(e,template) {
	// 	Session.set("filter", "favorites"); 
	// 	Session.set('nbPosts',Posts.find({favorites: true}).fetch().length); 
	// 	Session.set("click", Session.get("click")+1);
	// 	addClick(template.data.blog._id,"view favorites");
	// }, 
});