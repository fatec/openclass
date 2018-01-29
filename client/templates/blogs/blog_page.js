Template.blogPage.onCreated(function() {

	viewport = document.querySelector("meta[name=viewport]");
	viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=4');

	Session.set('blogId',this.data.blog._id);
	resetFilters();
	Session.set('postsServerNonReactive', Counts.findOne().count); // Set a non-reactive counter of posts -> here = all server posts
	resetPostInterval();
	Session.set('last', true);

	Deps.autorun(function() { // Autorun to reactively update subscription (filtering + interval of loaded posts)

		var postsToSkip = Session.get('postsToSkip');
		var postsLimit = Session.get('postsLimit');
				var postsLimit2 = Session.get('postsLimit2');


		var filters = {blogId:Session.get('blogId')};
		if (Session.get('author') != "")
			filters = {blogId:Session.get('blogId'), author:Session.get('author')}
		else if (Session.get('category') != "")
			filters = {blogId:Session.get('blogId'), category:Session.get('category')}
		else if (Session.get('tag') != "")
			filters = {blogId:Session.get('blogId'), tags:Session.get('tag')}
		else if (Session.get('pinned') == true) 
			filters = {blogId:Session.get('blogId'), pinned:true}
		else if (Session.get('files') == true) 
			filters = {blogId:Session.get('blogId'), fileExt:{$in : ["pdf", "rtf", "zip"]}}
		else if (Session.get('images') == true) 
			filters = {blogId:Session.get('blogId'), fileExt:{$in : ["jpg","jpeg","png","gif"]}}
		else if (Session.get('favorites') == true) {
			var favorites = Session.get(Session.get('blogId')).favorites;
			if (favorites)
				filters = {_id:{$in: favorites}}
		}


 		// Interval of posts subscription : load every posts from "postsToSkip" (skip) to "postsLimit" (limit)
 		// By default, load the 10 last posts (skip : total posts - 10 / limit : 10)
 		// postsLimit (limit) is used to disable reactivity

 		if (!Session.get('isReactive')) 
			subscription = Meteor.subscribe('posts', filters, postsToSkip, 0);
			//subscription = Meteor.subscribe('posts', filters, postsToSkip, postsLimit2);

		else
			subscription = Meteor.subscribe('posts', filters, postsToSkip, 0);
	});
});


Template.blogPage.events({

	'click .button-ok-update-alert': function() {
		Meteor.users.update(Meteor.user()._id, {$set: {"profile.lastAlert": 1}});
	},
	'change #blog-page--select-filter': function(e) {
		var val = $(e.target).val();
		if (val == "asc")
  			Session.set("last", true);
  		else
  			Session.set("last", false);
	},
	'click .button-send-to-api': function(e, template) {
			e.preventDefault();

			Meteor.call('sendBlog', {blogId: template.data.blog._id} );
		},
	'click .button-hide-code-panel': function(e) {
		e.preventDefault();

		$( "#codePanel" ).hide();

		Blogs.update(this.blog._id, {$set : {codePanel : 0}});         
	},
	// 'click .blog-page--posts-order': function(e) {
	// 	e.preventDefault();
	// 	Session.set('last', !Session.get('last'));
	// },
	'click .blog-page--load-more': function(e) { // If user want to load more posts, it moves the interval (skip : -10 / limit : +10)
		e.preventDefault();
		
		// if (Session.get('postsToSkip') <= 10)
		// 	Session.set('postsToSkip', 0);
		// else
		// 	Session.set('postsToSkip',Session.get('postsToSkip')-10);

		// Session.set('postsLimit',Session.get('postsLimit')+10);


		if (Session.get('postsServerNonReactive') - Session.get('postsLimit2') >= 10)
			Session.set('postsLimit2',Session.get('postsLimit2')+10);
		else
			Session.set('postsLimit2',Session.get('postsLimit2')+Counts.findOne().count - Session.get('postsLimit2'));
	},
	'click .blog-page--refresh': function(e) { // Refresh posts when user click on new messages button
		e.preventDefault();

		if (Session.get('author') !== "") {
			var author = Session.get('author');
			Session.set('postsServerNonReactive', Authors.findOne({name:author}).nRefs);
		}
		else if (Session.get('category') !== "") {
			var category = Session.get('category');
			Session.set('postsServerNonReactive', Categories.findOne({name:category}).nRefs);
		}
		else if (Session.get('tag') !== "") {
			var tag = Session.get('tag');
			Session.set('postsServerNonReactive', Tags.findOne({name:tag}).nRefs);
		}
		else if (Session.get('pinned') !== "") {
			Session.set('postsServerNonReactive', PinnedCounts.findOne().count);
		}
		else if (Session.get('files') !== "") {
			Session.set('postsServerNonReactive', FilesCounts.findOne().count);
		}		
		else if (Session.get('images') !== "") {
			Session.set('postsServerNonReactive', ImagesCounts.findOne().count);
		}
		else
			Session.set('postsServerNonReactive', Counts.findOne().count);

		resetPostInterval();
	}  
});


Template.blogPage.helpers({

	posts: function() {
		if (this.blog !== undefined && Session.get('last') == "")
			//return Posts.find({},{sort: {pinned: -1, submitted: 1}});
			return Posts.find({pinned:false},{sort: {pinned: -1, submitted: 1}});
		else if (this.blog !== undefined && Session.get('last') !== "")
			return Posts.find({pinned:false},{sort: {pinned: -1, submitted: -1}});
		else return null
	},
	postsPinned: function() {
		if (this.blog !== undefined && Session.get('last') == "")
			//return Posts.find({},{sort: {pinned: -1, submitted: 1}});
			return Posts.find({pinned:true},{sort: {submitted: 1}});
		else if (this.blog !== undefined && Session.get('last') !== "")
			return Posts.find({pinned:true},{sort: {submitted: -1}});
		else return null
	},
	loadMore: function() { // Check if user can load more posts
		//return (Session.get('postsToSkip') > 0)
		// var serverPosts = 0;

		// if (Session.get('author') !== "") {
		// 	var author = Session.get('author');
		// 	serverPosts = Authors.findOne({name:author}).nRefs;
		// }
		// else if (Session.get('category') !== "") {
		// 	var category = Session.get('category');
		// 	serverPosts = Categories.findOne({name:category}).nRefs;
		// }
		// else if (Session.get('tag') !== "") {
		// 	var tag = Session.get('tag');
		// 	serverPosts = Tags.findOne({name:tag}).nRefs;
		// }
		// else if (Session.get('pinned')) {
		// 	serverPosts = PinnedCounts.findOne().count;
		// }
		// else if (Session.get('files')) {
		// 	serverPosts = FilesCounts.findOne().count;
		// }		
		// else if (Session.get('images')) {
		// 	serverPosts = ImagesCounts.findOne().count;
		// }
		// else
		// 	serverPosts = Counts.findOne().count;

		// return (serverPosts > Session.get('postsLimit2'))
	},
	ascendant: function() {
		if (Session.get('last'))
			return "selected";
		else
			return null
	},
	descendant: function() {
		if (!Session.get('last'))
			return "selected";
		else
			return null
	},
	codePanelState: function() {
		return (this.blog.codePanel)
	},
	ownBlog: function() {
		var userId = Meteor.userId();
		var isAdmin = Roles.userIsInRole(Meteor.userId(), ['admin'])
		if (userId)
			if (this.blog.userId === userId)
				return true;
		else if (isAdmin)
			if (isAdmin === true)
				return true;
		else
			return false;
	},
	newMessages: function() { // Check if server posts  > client posts (if reactive is on)

		// var nbPosts = Session.get('postsServerNonReactive');
		// console.log("nbPosts : "+nbPosts);
		// var postsReactiveCount = Counts.findOne().count;
		// var postLoaded = Session.get('postsLimit2');
		// console.log("postLoaded : "+postLoaded);


		// if (nbPosts < postLoaded && nbPosts != 0)
		// 	return (postLoaded - nbPosts);
		// else
		// 	return false;

		// if (!Session.get('isReactive'))
		// {
		// 	var nbPosts = Session.get('postsServerNonReactive');
		// 	var postsReactiveCount;

		// 	if (Session.get('author') !== "") {
		// 		var author = Session.get('author');
		// 		postsReactiveCount = Authors.findOne({name:author}).nRefs;  
		// 	}
		// 	else if (Session.get('category') !== "") {
		// 		var category = Session.get('category');
		// 		postsReactiveCount = Categories.findOne({name:category}).nRefs;  
		// 	}
		// 	else if (Session.get('tag') !== "") {
		// 		var tag = Session.get('tag');
		// 		postsReactiveCount = Tags.findOne({name:tag}).nRefs;  
		// 	}
		// 	else if (Session.get('pinned') == true) {
		// 		postsReactiveCount = PinnedCounts.findOne().count;  
		// 	}
		// 	else if (Session.get('files') == true) {
		// 		postsReactiveCount = FilesCounts.findOne().count;  
		// 	}
		// 	else if (Session.get('images') == true) {
		// 		postsReactiveCount = ImagesCounts.findOne().count;  
		// 	}
		// 	else if (Session.get('favorites') == true) {
		// 		postsReactiveCount = CountsFavorites.findOne().count;  
		// 	}
		// 	else {
		// 		postsReactiveCount = Counts.findOne().count;
		// 	}

		// 	if (nbPosts < postsReactiveCount && nbPosts != 0)
		// 		return (postsReactiveCount - nbPosts);
		// 	else
		// 		return false;
		// }
		// else
		// 	return false;
	},
	isReactive: function() {
		return Session.get('isReactive');
	},
    updateAlert: function() {
    	if (Meteor.user()) {
      		if (Meteor.user().profile) {
        		if (Meteor.user().profile.lastAlert >= 1)
          			return false
        		else
          			return true
    		}
      		else return false
      	}
        else return false
    }
});