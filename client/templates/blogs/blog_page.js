Template.blogPage.helpers({
  posts: function() {
    return Posts.find({blogId: this._id}, {sort: {submitted: -1}});
  },
  postCount: function() { // return the number of posts
    return Posts.find().count();  }
});