BlogEditAuthorsController = RouteController.extend({

  waitOn: function () {
    return [
      Meteor.subscribe('authors', this.params._id),
      Meteor.subscribe('categories', this.params._id),
      Meteor.subscribe('blogs', this.params._id),
    ]
  },

  data: function () {
    return { 
      blog: Blogs.findOne(this.params._id),
    }
  },

  action: function () {
    this.render('blogEditHeader', {to: 'layout--header'});
    this.render('blogEditAuthors', {to: 'layout--main'});
  }
});