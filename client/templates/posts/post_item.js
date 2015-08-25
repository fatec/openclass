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