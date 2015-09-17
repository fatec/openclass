Router.configure({
  loadingTemplate: 'loading',
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  waitOn: function() { return [
    Meteor.subscribe('blogs')
    ]
    ;}
});


Router.route('/login', {
  name: 'login',

  action: function () {
    this.render('loginHeader', {to: 'layout--header'});
    this.render('login', {to: 'layout--main'});
  }
});


Router.route('/logout', {
  name: 'logout',

  action: function () {
    this.render('logoutHeader', {to: 'layout--header'});
    this.render('logout', {to: 'layout--main'});
  }
});


Router.route('/register', {
  name: 'register',

  action: function () {
    this.render('loginHeader', {to: 'layout--header'});
    this.render('register', {to: 'layout--main'});
  }
});


Router.route('/admin', {
  name: 'admin',

  waitOn: function () {
    return [
      Meteor.subscribe('allUsers')
       ];
  },  

  action: function () {
    this.render('blogsHeader', {to: 'layout--header'});
    this.render('admin', {to: 'layout--main'});
  }
});


Router.route('/', {
  name: 'blogsList',

  data: function () {
    return Blogs.findOne(this.params._id );
  },

  action: function () {
    this.render('blogsHeader', {to: 'layout--header'});
    this.render('blogsList', {to: 'layout--main'});
  }
});


Router.route('/journal/:_id', {
  name: 'blogPage',

  waitOn: function () {
      return [
        Meteor.subscribe('posts', this.params._id),
        Meteor.subscribe('tags', this.params._id)
        ];
  },
  subscriptions: function () {
    return [
      Meteor.subscribe('images', this.params._id)
       ];
  },
  data: function () {
    return Blogs.findOne(this.params._id );
  },

  action: function () {
    this.render('mobileMenu', {to: 'layout--menu'});    
    this.render('postsHeader', {to: 'layout--header'});
    this.render('blogPage', {to: 'layout--main'});
  },
  onAfterAction: function () {
    // Set the name of the active tag to highlight filter link
    Session.set("selectedTag", this.params.query.tags);
  }
});


Router.route('/journal/:_id/submit', {
  name: 'postSubmit',

  waitOn: function () {
    return [
      Meteor.subscribe('images', this.params._id),
      Meteor.subscribe('tags', this.params._id)
       ];
  },

  data: function () {
    delete Session.keys['imageId'];
    return {blog:Blogs.findOne(this.params._id)}  
  },

  action: function () {
    this.render('postSubmitHeader', {to: 'layout--header'});
    this.render('postSubmit', {to: 'layout--main'});
  }
});


/*
Router.route('/journal/:_id/:tag', {
  name: 'blogPageTag',

  waitOn: function () {
    return [
      Meteor.subscribe('postsTag', {blogId: this.params._id, tag: this.params.tag }),
      Meteor.subscribe('tags', this.params._id)
       ];
  },
  subscriptions: function () {
    return [
      Meteor.subscribe('images', this.params._id)
       ];
  },
  data: function () {
    return Blogs.findOne(this.params._id );
  },

  action: function () {
    this.layout('layout');
    this.render('postsHeader', {to: 'layout--header'});
    this.render('blogPage', {to: 'layout--main'});
  }
});
*/


Router.route('/publication/:_id/submit', {
  name: 'postEdit',

  waitOn: function () {
    blogId = Posts.findOne(this.params._id).blogId;
    return [
      Meteor.subscribe('postsEdit', this.params._id),
      Meteor.subscribe('postImage', this.params._id),
      Meteor.subscribe('tags', blogId)
    ]; 
  },

  data: function () {
    return Posts.findOne(this.params._id)  
  },

  action: function () {
    this.render('postEditHeader', {to: 'layout--header'});
    this.render('postEdit', {to: 'layout--main'});
  }
});


Router.route('/journal/:_id/edit', {
  name: 'blogEdit',

  data: function () {
    return Blogs.findOne(this.params._id)
  },

  action: function () {
    this.render('blogsHeader', {to: 'layout--header'});
    this.render('blogEdit', {to: 'layout--main'});
  }
});


Router.route('/submit', {
  name: 'blogSubmit',

  action: function () {
    this.render('blogsHeader', {to: 'layout--header'});
    this.render('blogSubmit', {to: 'layout--main'});
  }
});

// Auto-close the menu on route stop (when navigating to a new route)
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

// var requireAdmin = function() {
//     if (! Meteor.user()) {
//         if (Meteor.user().username === 'admin') {
//           alert("hop");
//             this.render(this.loadingTemplate);
//         } else {
//             this.render('accessDenied');
//         }
//     } else {
//       alert("hup");
//         this.next();
//     }
// }
//Router.onBeforeAction('loading');

// Router.onBeforeAction('loading');

//Router.onBeforeAction('dataNotFound', {only: 'blogPage'});
Router.onBeforeAction(requireLogin, {only: 'blogSubmit'});
Router.onBeforeAction(requireAdmin, {only: 'admin'});