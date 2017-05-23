Template.desktopMenu.helpers({

	postCount: function() {
		return this.posts.count();
	},
	authors: function() {
		return Authors.find({}, {sort: {name: 1}});
	},
	authorNRef: function() {
		return Posts.find({author:this.name}).fetch().length;
	},
	categories: function() {
		return Categories.find({}, {sort: {name: 1}});
	},
	categoriesNRef: function() {
		return Posts.find({category:this.name}).fetch().length;
	},
	tags: function() {
		return Tags.find({}, {sort: {name: 1}});
	},	
	tagsNRef: function() {
		return Posts.find({tags:{$in : [this.name]}}).fetch().length;
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
		Session.set('nbPosts',Posts.find({}).fetch().length); 
	},
	'click .filter-tag': function(e) {
		e.preventDefault();
		var tag = $(e.target).data('tag');
		Session.set("author",'');
		Session.set("category",''); 
		Session.set('tag',tag);
		Session.set('nbPosts',Posts.find({tags: tag}).fetch().length); 
	},
	'click .filter-author': function(e) {
		e.preventDefault();
		var author = $(e.target).data('author');
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
		Session.set('category',category);
		Session.set('nbPosts',Posts.find({category: category}).fetch().length); 
	} 
	// 'click .desktop-menu--link-favorites': function(e,template) {
	// 	Session.set("filter", "favorites"); 
	// 	Session.set('nbPosts',Posts.find({favorites: true}).fetch().length); 
	// 	Session.set("click", Session.get("click")+1);
	// 	addClick(template.data.blog._id,"view favorites");
	// }, 
});