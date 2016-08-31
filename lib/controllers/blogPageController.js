BlogPageController = RouteController.extend({

  onBeforeAction: function () {

    if (!Session.get(this.params._id))  {
      // if the user is not logged in, render the Login template
      this.render('blogEditHeader', {to: 'layout--header'});
      this.render('blogUsers', {to: 'layout--main'});

          } else {
      // otherwise don't hold up the rest of hooks or our route/action function
      // from running
      this.next();
    }
},

  waitOn: function () {
    // if(Meteor.isClient) {
    //   if (!Session.get(this.params._id)) 
    //     {
    //   Session.set(this.params._id, {author: 'Invité'});  

    //   }
    // }  

	return [
		Meteor.subscribe('images', this.params._id),
		Meteor.subscribe('postsVersions', this.params._id),
		Meteor.subscribe('posts', this.params._id),
		Meteor.subscribe('blogs', this.params._id),
		Meteor.subscribe('tags', this.params._id),
		Meteor.subscribe('authors', this.params._id),
		Meteor.subscribe('categories', this.params._id)  
	];
  },
  data: function () {
    return {
		blog: Blogs.findOne(this.params._id ),
    posts: Posts.find({blogId:this.params._id})
    }
  },
	action: function () {
   		this.render('mobileMenu', {to: 'layout--menu'});    
    	this.render('postsHeader', {to: 'layout--header'});
    	this.render('blogPage', {to: 'layout--main'});
	},
	onAfterAction: function () {
    	// Set the name of the active tag to highlight filter link
   		Session.set("selectedTag", this.params.query.tags);
    	Session.set("selectedAuthor", this.params.query.author);
    	Session.set("selectedCategory", this.params.query.category);
    	Session.set("sortPosts", "last");    
	},
  fastRender: true
});