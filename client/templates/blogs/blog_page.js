Template.blogPage.helpers({
  posts: function() {
    if (Router.current().params.query.sort_posts == "last")
          return Posts.find({blogId: this._id}, {sort: {submitted: -1}});
    else if (Router.current().params.query.tags)
        return Posts.find({tags: {$in: [Router.current().params.query.tags]}});
    else
      return Posts.find();
},
  postCount: function() { // return the number of posts
    return Posts.find().count();
  },
});

Template.blogPage.events({
	'click .button-send-to-api': function(e, template) {
      e.preventDefault();
      //console.log("On clique sur le bouton "+template.data._id)
      Meteor.call('sendBlog', {blogId: template.data._id} );
    }
});