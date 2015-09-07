Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return [
    Meteor.subscribe('blogs')
    ]
    ;}
});


Router.route('/login', {
  name: 'login',

  action: function () {
    this.layout('layout');
    this.render('loginHeader', {to: 'layout--header'});
    this.render('login', {to: 'layout--main'});
  }
});


Router.route('/logout', {
  name: 'logout',

  action: function () {
    this.layout('layout');
    this.render('loginHeader', {to: 'layout--header'});
    this.render('logout', {to: 'layout--main'});
  }
});


Router.route('/register', {
  name: 'register',

  action: function () {
    this.layout('layout');
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
    this.layout('layout');
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
    this.layout('layout');
    this.render('blogsHeader', {to: 'layout--header'});
    this.render('blogsList', {to: 'layout--main'});
  }
});


Router.route('/journal/:_id', {
  name: 'blogPage',

  waitOn: function () {
    return [
      Meteor.subscribe('posts', this.params._id),
      Meteor.subscribe('images', this.params._id),
      Meteor.subscribe('tags', this.params._id)
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
    this.layout('layout');
    this.render('postSubmitHeader', {to: 'layout--header'});
    this.render('postSubmit', {to: 'layout--main'});
  }
});


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
    this.layout('layout');
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
    this.layout('layout');
    this.render('blogsHeader', {to: 'layout--header'});
    this.render('blogEdit', {to: 'layout--main'});
  }
});


Router.route('/submit', {
  name: 'blogSubmit',

  action: function () {
    this.layout('layout');
    this.render('blogsHeader', {to: 'layout--header'});
    this.render('blogSubmit', {to: 'layout--main'});
  }
});


// Router.route('/journal/:_id/submit', {
//   name: 'postSubmit',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//     'postSubmitHeader': {to: 'layout--header'},    
//     'postSubmit': {to: 'layout--main'}
//   },
//     waitOn: function () {      return [
//          Meteor.subscribe('images', this.params._id),
//          Meteor.subscribe('tags', this.params._id)
//        ]; },
//   data: function() {
//       delete Session.keys['imageId'];
//       return {blog:Blogs.findOne(this.params._id)}
//     } 
// });

// Router.route('/publication/:_id/edit', {
//   name: 'postEdit',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//       'postEditHeader': {to: 'layout--header'},    
//       'postEdit': {to: 'layout--main'}
//     },
//     waitOn: function () {
//       blogId = Posts.findOne(this.params._id).blogId;
//       return [
//         Meteor.subscribe('postsEdit', this.params._id),
//         Meteor.subscribe('postImage', this.params._id),
//          Meteor.subscribe('tags', blogId)
//                ]; },
//   data: function() { return Posts.findOne(this.params._id) }
// });


// Router.route('/journal/:_id/edit', {
//   name: 'blogEdit',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//       'blogsHeader': {to: 'layout--header'},    
//       'blogEdit': {to: 'layout--main'}
//     },
//   data: function() { return Blogs.findOne(this.params._id) }
// });

// Router.route('/login', {
//   name: 'login',
//   layoutTemplate: 'layout',
//     yieldTemplates: {
//     'loginHeader': {to: 'layout--header'},
//     'login': {to: 'layout--main'}
//     }
// });

// Router.route('/logout', {
//   name: 'logout',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//     'loginHeader': {to: 'layout--header'},
//     'logout': {to: 'layout--main'}
//     }
// });

// Router.route('/register', {
//   name: 'register',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//     'loginHeader': {to: 'layout--header'},
//     'register': {to: 'layout--main'}
//     }
// });

// Router.route('/submit', {
//   name: 'blogSubmit',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//       'blogsHeader': {to: 'layout--header'},    
//       'blogSubmit': {to: 'layout--main'}
//     }
// });


//Router.route('/', {
//   name: 'blogsList',
//   layoutTemplate: 'layout',
//     yieldTemplates: {
//       'blogsHeader': {to: 'layout--header'},    
//       'blogsList': {to: 'layout--main'}
//         },
//   data: function() { return Blogs.findOne(this.params._id );}
// });

// Router.route('/post/:_id', function () {
//   this.render('Post', {
//     data: function () {
//       return Posts.findOne({_id: this.params._id});
//     }
//   });
// });


//   name: 'blogPage',
//   layoutTemplate: 'layout',
//   loadingTemplate: 'loading',
//   yieldTemplates: {
//     'postsHeader': {to: 'layout--header'},
//     'blogPage': {to: 'layout--main'}
//     },
//     onBeforeAction: function () {      return [
//          Meteor.subscribe('posts', this.params._id),
//          Meteor.subscribe('images', this.params._id),
//          Meteor.subscribe('tags', this.params._id),
//          Blogs.findOne(this.params._id )
//          //alert("hop")
//        ]; },
//          data: function() { return Blogs.findOne(this.params._id );},
// });

// Router.route('/journal/:_id', {
//   name: 'blogPage',
//   layoutTemplate: 'layout',
//   loadingTemplate: 'loading',
//   yieldTemplates: {
//     'postsHeader': {to: 'layout--header'},
//     'blogPage': {to: 'layout--main'}
//     },
//     waitOn: function () {      return [
//          Meteor.subscribe('posts', this.params._id),
//          Meteor.subscribe('images', this.params._id),
//          Meteor.subscribe('tags', this.params._id),
//          Blogs.findOne(this.params._id )
//          //alert("hop")
//        ]; },
//          data: function() { return Blogs.findOne(this.params._id );},
// });
//Router.onBeforeAction('loading');

// Router.onBeforeAction("loading");
// Router.route('/', {name: 'blogsList', layoutTemplate: 'blogsLayout'});

// Router.route('/login', {name: 'login', layoutTemplate: 'blogsLayout'});

// Router.route('/logout', {name: 'logout', layoutTemplate: 'blogsLayout'});

// Router.route('/register', {name: 'register', layoutTemplate: 'blogsLayout'});

// On affiche le journal
// Il faut souscrire a tous les posts de ce journal et toutes les images de ce journal
// Router.route('/journal2/:_id', {
//   name: 'blogPage2',
//   layoutTemplate: 'postsLayout',
//   waitOn: function() {
//       return [
//         Meteor.subscribe('posts', this.params._id),
//         Meteor.subscribe('images', this.params._id)
//       ];
//   },
//   data: function() { return Blogs.findOne(this.params._id );}
// });
// Router.map(function () {
//   this.route('login', {
//   path: '/login',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//     'loginHeader': {to: 'layout--header'},
//     'login': {to: 'layout--main'}
//     }
//   });
// });

// Router.map(function () {
//   this.route('logout', {
//   path: '/logout',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//     'loginHeader': {to: 'layout--header'},
//     'logout': {to: 'layout--main'}
//     }
//   });
// });

// Router.map(function () {
//   this.route('register', {
//   path: '/register',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//     'loginHeader': {to: 'layout--header'},
//     'register': {to: 'layout--main'}
//     }
//   });
// });

// Router.map(function () {
//   this.route('blogsList', {
//   path: '/',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//       'blogsHeader': {to: 'layout--header'},    
//       'blogsList': {to: 'layout--main'}
//         }
//   });
// });
// Router.route('/journal/:_id', {
//   name: 'blogPage',
//   layoutTemplate: 'layout',
//     yieldTemplates: {
//     'postsHeader': {to: 'layout--header'},
//     'blogPage': {to: 'layout--main'}
//     },
//   waitOn: function() {
//       return [
//         Meteor.subscribe('posts', this.params._id),
//         Meteor.subscribe('images', this.params._id)
//       ];
//   },
//   data: function() { return Blogs.findOne(this.params._id );}
// });


// Router.map(function () {
//   this.route('blogPage2', {
//   path: '/journal2/:_id',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//     'postsHeader': {to: 'layout--header'},
//     'blogPage': {to: 'layout--main'}
//     },
//     waitOn: function () {      return [
//          Meteor.subscribe('posts', this.params._id),
//          Meteor.subscribe('images', this.params._id)
//        ]; },
//          data: function() { return Blogs.findOne(this.params._id );}
//   });
// });

// Router.map(function () {
//   this.route('postSubmit', {
//   path: '/journal/:_id/submit',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//       'postSubmitHeader': {to: 'layout--header'},    
//       'postSubmit': {to: 'layout--main'}
//     },
//     waitOn: function () {      return [
//          Meteor.subscribe('images', this.params._id)
//        ]; },
//   data: function() {
//       delete Session.keys['imageId'];
//       return {blog:Blogs.findOne(this.params._id)}
//     }  });
// });

// Router.map(function () {
//   this.route('postEdit', {
//   path: '/publication/:_id/edit',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//       'postEditHeader': {to: 'layout--header'},    
//       'postEdit': {to: 'layout--main'}
//     },
//     waitOn: function () {      return [
//         Meteor.subscribe('postsEdit', this.params._id),
//         Meteor.subscribe('postImage', this.params._id)
//                ]; },
//   data: function() { return Posts.findOne(this.params._id) }
//   });
// });

// Router.map(function () {
//   this.route('blogEdit', {
//   path: '/journal/:_id/edit',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//       'blogsHeader': {to: 'layout--header'},    
//       'blogEdit': {to: 'layout--main'}
//     },
//   data: function() { return Blogs.findOne(this.params._id) }
//   });
// });


// Router.map(function () {
//   this.route('blogSubmit', {
//   path: '/submit',
//   layoutTemplate: 'layout',
//   yieldTemplates: {
//       'blogsHeader': {to: 'layout--header'},    
//       'blogSubmit': {to: 'layout--main'}
//     }
//   });
// });

// Router.route('/submit', {name: 'blogSubmit',
//   layoutTemplate: 'blogsLayout',
// });

// Router.route('/journal/:_id/edit', {
//   name: 'blogEdit',
//     layoutTemplate: 'blogsLayout',

//   data: function() { return Blogs.findOne(this.params._id); }
// });
// // On a besoin de souscrire à l'image du post
// Router.route('/publication/:_id/edit', {
//   name: 'postEdit',
//   layoutTemplate: 'postsLayout',  
//   waitOn: function() {
//       return [
//         Meteor.subscribe('postsEdit', this.params._id),
//         Meteor.subscribe('postImage', this.params._id)
//       ];
//   },
//   data: function() { return Posts.findOne(this.params._id); }
// });

// Router.route('/journal/:_id', function() {
//   name: 'blogPage',
//     this.layout('blogsLayout', {
//     data: function () {      return [
//         Meteor.subscribe('posts', this.params._id),
//         Meteor.subscribe('images', this.params._id)
//       ]; }
//     });
//     this.render('postsHeader', {to: 'header'});

//   });

//   name: 'blogPage',
//   layoutTemplate: 'postsLayout',
//   waitOn: function() {
//       return [
//         Meteor.subscribe('posts', this.params._id),
//         Meteor.subscribe('images', this.params._id)
//       ];
//   },
//   data: function() { return Blogs.findOne(this.params._id );},
//   function() {
//   }

// });



// // On a besoin de souscrire aux images du blog pour afficher celle que l'on ajoute
// Router.route('/journal/:_id/submit', {
//   name: 'postSubmit',
//   layoutTemplate: 'postSubmitLayout',

//   waitOn: function() {
//       //console.log("On souscris aux images dans submit pour le blog "+this.params._id);
//       return [
//         Meteor.subscribe('images', this.params._id)
//       ];
//   },
//   data: function() {
//       delete Session.keys['imageId'];
//       return {
//         blog: Blogs.findOne(this.params._id),
//   //      timestamp: Date.now()
//       }
//     }
// });








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
          this.layout('layout');
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