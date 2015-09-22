Template.blogPage.helpers({
  posts: function() {
    var sortPosts = Session.get('sortPosts');
    var sort;
    if(sortPosts == "last")
      sort = -1;
    else
      sort = 1;
    if (Router.current().params.query.tags)
      return Posts.find({tags: {$in: [Router.current().params.query.tags]}}, {sort: {submitted: sort}});
    else if (Router.current().params.query.author)
      return Posts.find({author: {$in: [Router.current().params.query.author]}}, {sort: {submitted: sort}});
    else
      return Posts.find({blogId: this._id}, {sort: {submitted: sort}});
  },
  postCount: function() { // return the number of posts
    return Posts.find().count();
  }
});

Template.blogPage.events({
	'click .button-send-to-api': function(e, template) {
      e.preventDefault();
      //console.log("On clique sur le bouton "+template.data._id)
      Meteor.call('sendBlog', {blogId: template.data._id} );
    }
});