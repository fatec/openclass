Template.blogPage.helpers({
    bloog: function() {
    console.log("hop");
    //return this.blogId;
  },
  posts: function() {
    return Posts.find({blogId: this._id}, {sort: {submitted: -1}});
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

  // posts: function() {
  //   if (Router.current().params.hash) {
  //       var tagsFilter = Router.current().params.hash.split(',');
  //     console.log("nombre de tags "+tagsFilter.length);
  // }
  // if (tagsFilter) {
  //   return Posts.find({blogId: this._id, tags: {$in: tagsFilter}}, {sort: {submitted: -1}});
  // } else {
  //   return Posts.find({blogId: this._id}, {sort: {submitted: -1}});
  // }
  // },