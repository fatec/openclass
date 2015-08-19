Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('blogs');}
});

Router.route('/', {name: 'blogsList'});
Router.route('/journal/:_id', {
  name: 'blogPage',
  waitOn: function() {
    return Meteor.subscribe('posts', this.params._id);
  },
  data: function() { return Blogs.findOne(this.params._id); }
});
Router.route('/journal/:_id/edit', {
  name: 'blogEdit',
  data: function() { return Blogs.findOne(this.params._id); }
});
Router.route('/journal/:_id/submit', {
  name: 'postSubmit',
  data: function() { return Blogs.findOne(this.params._id); }
});
Router.route('/publication/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('postsEdit', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});


Router.route('/submit', {name: 'blogSubmit'});


var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}


Router.onBeforeAction('dataNotFound', {only: 'blogPage'});
Router.onBeforeAction(requireLogin, {only: 'blogSubmit'});