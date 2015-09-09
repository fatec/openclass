Template.blogPage.helpers({
  posts: function() {
  	if (Router.current().params.hash) {
  			var tagsFilter = Router.current().params.hash.split(',');
			console.log("nombre de tags "+tagsFilter.length);
	}
	if (tagsFilter) {
		return Posts.find({blogId: this._id, tags: {$in: tagsFilter}}, {sort: {submitted: -1}});
	} else {
		return Posts.find({blogId: this._id}, {sort: {submitted: -1}});
	}
  },
  postCount: function() { // return the number of posts
    return Posts.find().count();
  }
});