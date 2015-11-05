// General router configuration
Router.configure({
  loadingTemplate: 'loading',
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [
      Meteor.subscribe('blogs')
    ]
  ;}
});

Router.configureBodyParsers = function() {
  Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));
};

// Auto-close  slide menu on route stop (when navigating to a new route)
Router.onStop(function () {
  if (slideout) {
    slideout.close();
  }
});

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

var requireAdmin = function() {
    if (! Roles.userIsInRole(Meteor.user(), 'admin')) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
          this.render('blogsHeader', {to: 'layout--header'});
          this.render('accessDenied', {to: 'layout--main'});
        }
    } else {
        this.next();
    }
}

// ###### Router hooks ######

Router.onBeforeAction(requireLogin, {only: 'blogSubmit'});
Router.onBeforeAction(requireAdmin, {only: 'admin'});


// ###### Router controllers ######

Router.route('/login', { name: 'login', controller: 'LoginController' });

Router.route('/logout', { name: 'logout', controller: 'LogoutController' });

Router.route('/register', { name: 'register', controller: 'RegisterController' });

Router.route('/admin', { name: 'admin', controller: 'AdminController' });

Router.route('/', { name: 'blogsList', controller: 'BlogsListController' });

Router.route('/journal/:_id', { name: 'blogPage', controller: 'BlogPageController' });

Router.route('/journal/:_id/submit', { name: 'postSubmit', controller: 'PostSubmitController' });

Router.route('/publication/:_id/edit', { name: 'postEdit', controller: 'PostEditController' });

Router.route('/journal/:_id/edit', { name: 'blogEdit', controller: 'BlogEditController' });

Router.route('/submit', { name: 'blogSubmit', controller: 'BlogSubmitController' });

Router.route('/api/blogs', { controller: 'ApiBlogsController' }, {where: 'server'});

Router.route('/api/posts', { controller: 'ApiPostsController' }, {where: 'server'});

Router.route('/api/image', { controller: 'ApiImageController' }, {where: 'server'});

