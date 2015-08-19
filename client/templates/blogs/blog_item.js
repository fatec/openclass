Template.blogItem.helpers({
  ownBlog: function() {
    return this.userId === Meteor.userId();
  }
});
