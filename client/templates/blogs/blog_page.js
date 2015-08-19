Template.blogPage.helpers({
  posts: function() {
    return Posts.find({blogId: this._id});
  }
});