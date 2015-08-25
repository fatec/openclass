Template.blogPage.helpers({
  posts: function() {
    return Posts.find({blogId: this.blog._id}, {sort: {submitted: -1}});
  }
});