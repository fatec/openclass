Template.postItem.onRendered(function() {

	$('.post-item--add-comment-textarea').autosize(); // Textarea autosize

	if (!Session.get(Template.parentData(1).blog._id)) // Set default author
		Session.set(Template.parentData(1).blog._id, {author: 'Invité'});    

	$('.post-item--image-wrapper').imagesLoaded(function() { // Show image in a lightbox with magnificPopup plugin
		$('.post-item--image-link').magnificPopup({
			type:'image',
			closeOnContentClick:'true',
		});
	});

	$('.post-item--text').linkify(); // Detect URLs and create links
	$('.post-item--comment-text').linkify();
});


Template.postItem.events({

	'click .post-item--button-delete': function(e) {
		e.preventDefault();

		if (confirm("Effacer la publication de "+this.author+"?")) {
			var currentPostId = this._id;
			var currentPost = Posts.findOne(currentPostId);
			Posts.remove(currentPostId, function(error) {
				if (error)
          			alert("Une erreur est survenue : "+error.message);
			});

			if (Session.get('author') !== "") {
				var author = Session.get('author');
				Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
			}
			else if (Session.get('category') !== "") {
				var category = Session.get('category');
				Session.set('nbPosts',Posts.find({category: category}).fetch().length); 
			}
			else if (Session.get('tag') !== "") {
				var tag = Session.get('tag');
				Session.set('nbPosts',Posts.find({tags: tag}).fetch().length); 
			}
			else
				Session.set('postsServerNonReactive', Counts.findOne().count);

			resetPostInterval();
		}
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
	'click .post-item--add-like': function(e) {
		e.preventDefault();

		var currentPostId = this._id;
		var author = Session.get(Template.parentData(1).blog._id).author; 
		Posts.update(currentPostId, {$push: {likes: author}});
	}, 
	'click .post-item--remove-like': function(e) {
		e.preventDefault();

		var currentPostId = this._id;
		var author = Session.get(Template.parentData(1).blog._id).author; 
		Posts.update(currentPostId, {$pull: {likes: author}});
	}, 
	'click .post-item--comment-add-like': function(e) {
		e.preventDefault();

		var currentPostId = $(e.target).data('postid');
		var currentCommentId = this.id;
		var author = Session.get(Template.parentData(1).blog._id).author; 
		Meteor.call('addLikeComment',{currentPostId:currentPostId,currentCommentId:currentCommentId,author,author});
	}, 
	'click .post-item--comment-remove-like': function(e) {
		e.preventDefault();

		var currentPostId = $(e.target).data('postid');
		var currentCommentId = this.id;
		var author = Session.get(Template.parentData(1).blog._id).author; 
		Meteor.call('removeLikeComment',{currentPostId:currentPostId,currentCommentId:currentCommentId,author,author});
	}, 
	'click .post-item--comment-delete': function(e) {
		e.preventDefault();

		var currentPostId = $(e.target).data('postid');
		var currentCommentId = this.id;

		if (confirm("Effacer le commentaire ?"))
			Posts.update(currentPostId, {$pull: {comments: {id:currentCommentId}}});
	},
	'click .post-item--show-comment-input': function(e) {
      e.preventDefault();

      $(e.target).parent().find('textarea').show();
      $(e.target).hide();
  	},
	'keypress .post-item--add-comment-textarea': function (e, template) {
		if (e.which === 13) {
			e.preventDefault();
			var currentPostId = this._id;
			var comment = $(e.target).val();
			var author = Session.get(Template.parentData(1).blog._id).author; 
			if (comment != "") {
				Posts.update(currentPostId, {$push: {comments: {id:Random.id(),author: author, submitted:Date.now(),text:comment}}});
				$(e.target).val('');
			}
		}
	},  	
	'click .post-item--button-add-favorite': function(e) {
		e.preventDefault();
		var currentPostId = this._id;

		var session = Session.get(Template.parentData(1).blog._id);

		if (session.favorites)
			session.favorites.push(currentPostId);
		else {
			session.favorites = [];
			session.favorites.push(currentPostId);
		}
		
		Session.setPersistent(Template.parentData(1).blog._id, session); // Persistent to browser refresh
	},
	'click .post-item--button-remove-favorite': function(e) {
		e.preventDefault();
		var currentPostId = this._id;

		var session = Session.get(Template.parentData(1).blog._id);

		if (session.favorites) {
			session.favorites = $.grep(session.favorites, function(value) { // Remove currentPostID from favorites array
			  return value != currentPostId;
			});
		}

		Session.setPersistent(Template.parentData(1).blog._id, session);
	},
	'click .post-item--button-add-pinned': function(e) {
		e.preventDefault();
		var currentPostId = this._id;

		Posts.update(currentPostId, {$set: {pinned: true}});
	},
	'click .post-item--button-remove-pinned': function(e) {
		e.preventDefault();
		var currentPostId = this._id;

		Posts.update(currentPostId, {$set: {pinned: false}});
	}	
});


Template.postItem.helpers({

	favorite: function() {
		if ($.inArray(this._id,Session.get(Template.parentData(1).blog._id).favorites) == -1)
			return false;
		else
			return true;
	},
	pinned: function() {
		return this.pinned;
	},
	commentsAllowed: function() {
		if (Template.parentData().blog.commentsAllowed)
			return true;
	},
	tags: function(){
		if (this.tags.length > 1 || this.tags[0] != "")
			return this.tags;
		else
			return 0;
	},
	likes: function() {
		if (this.likes)
			return this.likes.length;
	},
	likesWithoutMe: function() {
		if (this.likes)
			return this.likes.length-1;
	},
	likeAlready: function() { // Check if user already like the post
		var author = Session.get(Template.parentData(1).blog._id).author; 
		if ($.inArray(author,this.likes) != -1)
			return true
	},
	othersLikes: function() {
		if (this.likes)
			if (this.likes.length > 1)
				return true;
	},
	likesComment: function() {
		if (this.likes)
			return this.likes.length;
	},
	likeAlreadyComment: function() {
		var author = Session.get(Template.parentData(2).blog._id).author; 
		if ($.inArray(author,this.likes) != -1)
			return true;
	},
	othersLikesComment: function() {
		if (this.likes)
			if (this.likes.length > 1)
				return true;
	},
	likesWithoutMeComment: function() {
		if (this.likes)
			return this.likes.length-1;
	},
	editAllowed: function() {
		if (Template.parentData().blog.postEditPermissions !== undefined) {
			if (Template.parentData().blog.postEditPermissions === "all" || (Template.parentData().blog.postEditPermissions === "own" && Session.get(Template.parentData().blog._id).author === this.author) || Template.parentData().blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
				return true
			else
				return false
		}
		else {
			if (Session.get(Template.parentData().blog._id).author === this.author || Template.parentData().blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
				return true
			else
				return false
		}
	},
	commentEditAllowed: function() {
		if (Template.parentData(2).blog.postEditPermissions !== undefined) {
			if (Template.parentData(2).blog.postEditPermissions === "all" || (Template.parentData(2).blog.postEditPermissions === "own" && Session.get(Template.parentData(2).blog._id).author === this.author) || Template.parentData(2).blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
				return true
			else
				return false
		}
		else {
			if (Session.get(Template.parentData(2).blog._id).author === this.author || Template.parentData(2).blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
				return true
			else
				return false
		}
	},
	'selectedAuthorClass': function(){
		if (this.author == Session.get('author'))
			return "post-item--author-selected"
	},	
	'selectedCategoryClass': function(){
		if (this.category == Session.get('category'))
			return "post-item--category-selected"
	},
	'selectedTagClass': function(){
		if (this == Session.get('tag'))
			return "post-item--tag-selected"
	},
});