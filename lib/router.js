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