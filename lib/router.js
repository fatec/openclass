Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return [
    Meteor.subscribe('blogs')
    ]
    ;}
});

Router.route('/', {name: 'blogsList', layoutTemplate: 'blogsLayout'});

Router.route('/login', {name: 'login', layoutTemplate: 'blogsLayout'});

Router.route('/logout', {name: 'logout', layoutTemplate: 'blogsLayout'});

Router.route('/register', {name: 'register', layoutTemplate: 'blogsLayout'});

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

Router.map(function () {
  this.route('blogPage', {
  path: '/journal/:_id',
  layoutTemplate: 'postsLayout',
  yieldTemplates: {
      'blogPage': {to: 'main'},
      'postsHeader': {to: 'header'},
      'postsMenu': {to: 'menu'}
    },
    waitOn: function () {      return [
         Meteor.subscribe('posts', this.params._id),
         Meteor.subscribe('images', this.params._id)
       ]; },
         data: function() { return Blogs.findOne(this.params._id );}
  });
});

Router.map(function () {
  this.route('postSubmit', {
  path: '/journal/:_id/submit',
  layoutTemplate: 'postsLayout',
  yieldTemplates: {
      'postSubmit': {to: 'main'},
      'postSubmitHeader': {to: 'header'},
      'postsMenu': {to: 'menu'}
    },
    waitOn: function () {      return [
         Meteor.subscribe('images', this.params._id)
       ]; },
  data: function() {
      delete Session.keys['imageId'];
      return {
        blog: Blogs.findOne(this.params._id),
  //      timestamp: Date.now()
      }
    }  });
});

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

// On change simplement le nom du journal
Router.route('/journal/:_id/edit', {
  name: 'blogEdit',
    layoutTemplate: 'blogsLayout',

  data: function() { return Blogs.findOne(this.params._id); }
});

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


// On a besoin de souscrire à l'image du post
Router.route('/publication/:_id/edit', {
  name: 'postEdit',
  layoutTemplate: 'postsLayout',  
  waitOn: function() {
      return [
        Meteor.subscribe('postsEdit', this.params._id),
        Meteor.subscribe('postImage', this.params._id)
      ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});


Router.route('/submit', {name: 'blogSubmit',
  layoutTemplate: 'blogsLayout',
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


Router.onBeforeAction('dataNotFound', {only: 'blogPage'});
Router.onBeforeAction(requireLogin, {only: 'blogSubmit'});