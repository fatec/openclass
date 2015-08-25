Template.blogPage.helpers({
  posts: function() {
    return Posts.find({blogId: this.blog._id}, {sort: {submitted: -1}});
  }
});

Template.uploadedInfo.helpers({
  src: function() {
    if (this.type.indexOf('image') >= 0) {
      return 'upload/' + this.path;
    } else return 'file_icon.png';
  }
});