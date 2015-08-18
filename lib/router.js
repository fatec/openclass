Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('blogs');}
});

Router.route('/', {name: 'blogsList'});
