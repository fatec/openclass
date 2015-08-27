Template.postItem.helpers({
  image: function() {
/*  	console.log("Les données dispo ici: ");
  	console.log("body: "+ this.body);
  	console.log("blogId: "+this.blogId);
  	console.log("_id: "+this._id);*/
  	//return "coucou";
  	//return Images.findOne();
    return Images.findOne({'metadata.blogId': this.blogId, 'metadata.postId': this._id});
  }
});
  Template.postItem.events({
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      var currentPost = Posts.findOne(currentPostId);
      Posts.remove(currentPostId);
      Router.go('blogPage', {_id: currentPost.blogId});
    }
  }
  });
