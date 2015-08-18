Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('blogs');}
});

Router.route('/', {name: 'blogsList'});
Router.route('/journal/:_id', {
  name: 'blogPage',
  data: function() { return Blogs.findOne(this.params._id); }
});


Router.onBeforeAction('dataNotFound', {only: 'blogPage'});