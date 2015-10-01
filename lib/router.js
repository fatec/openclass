Router.configure({
  loadingTemplate: 'loading',
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  waitOn: function() { return [
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

Router.route('/login', {
  name: 'login',

  data: function() {
    return {
    }
  },

  action: function () {
    this.render('loginHeader', {to: 'layout--header'});
    this.render('login', {to: 'layout--main'});
  }
});


Router.route('/logout', {
  name: 'logout',

  data: function() {
    return {
    }
  },

  action: function () {
    this.render('logoutHeader', {to: 'layout--header'});
    this.render('logout', {to: 'layout--main'});
  }
});


Router.route('/register', {
  name: 'register',

  data: function() {
    return {
    }
  },

  action: function () {
    this.render('registerHeader', {to: 'layout--header'});
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

  data: function() {
    return {
    }
  },

  action: function () {
    this.render('header', {to: 'layout--header'});
    this.render('admin', {to: 'layout--main'});
  }
});


Router.route('/', {
  name: 'blogsList',
  subscriptions: function () {
  //  return [
      Meteor.subscribe('blogsVersions')
  //  ];
  },

  data: function () {
    return {
  //    blog: Blogs.findOne(this.params._id ),
    }
    //return Blogs.findOne(this.params._id );
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
        Meteor.subscribe('tags', this.params._id),
        Meteor.subscribe('authors', this.params._id)        
        ];
  },
  subscriptions: function () {
    return [
      Meteor.subscribe('images', this.params._id),
      Meteor.subscribe('postsVersions', this.params._id)    
    ];
  },
  data: function () {
    return {
      blog: Blogs.findOne(this.params._id ),
    }
  },

  action: function () {
    this.render('mobileMenu', {to: 'layout--menu'});    
    this.render('postsHeader', {to: 'layout--header'});
    this.render('blogPage', {to: 'layout--main'});
  },
  onAfterAction: function () {
    // Set the name of the active tag to highlight filter link
    Session.set("selectedTag", this.params.query.tags);
    Session.set("selectedAuthor", this.params.query.author);

    if (!Session.get('sortPosts'))
      Session.set("sortPosts", "all");    


    //Session.set("sortPosts", this.params.query.sort_posts);    
  }
});


Router.route('/journal/:_id/submit', {
  name: 'postSubmit',

  waitOn: function () {
    return [
      Meteor.subscribe('images', this.params._id),
      Meteor.subscribe('tags', this.params._id),
      Meteor.subscribe('authors', this.params._id)
       ];
  },

  data: function () {    return {

      blog:Blogs.findOne(this.params._id),
    }
  },

  action: function () {
    this.render('postSubmitHeader', {to: 'layout--header'});
    this.render('postSubmit', {to: 'layout--main'});
  },
  onAfterAction: function () {
      // On met dans la session l'image actuelle et on reinitialise la valeur de session imageToDelete
      Session.set('imagesId', false);
      Session.set('imagesToDelete', []);
      Session.set('imageToAdd', false);
  }
});




// api:      http://localhost:3000/api/blogs
// example:  http://localhost:3000/api/blogs
Router.route('/api/blogs', function(){
  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  //console.log("REST : SERVER : On recoit les informations suivantes "+Object.keys(this.request.body));
  //console.log("REST : SERVER : On recoit les informations suivantes "+this.request.body.blog._id);
  var reponse = "";
  Meteor.call('doesBlogExist',this.request.body, function(error, result) {
    if(error){
      reponse = {status: 'fail', params: {message: 'Zut ca ne marche pas..!', error: error}}
    }else{
      //console.log("REST : taille de result "+ result.length);
      reponse =  {status: 'success', params: {message: "C'est envoyé.. mais peut être tout a planté? :D", result: result}};
    }
  });
  this.response.end(JSON.stringify(
    reponse
  ));
 // this.response.end('Found some posts...  ' + JSON.stringify(
 //   reponse
 // ));
}, {where: 'server'});



// api:      http://localhost:3000/api/blogs
// example:  http://localhost:3000/api/blogs
Router.route('/api/posts', function(){
  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  console.log("REST : posts : On recoit les informations suivantes "+Object.keys(this.request.body));
  var reponse = "";
  Meteor.call('blogCopy',this.request.body, function(error, result) {
    if(error){
      reponse = {status: 'fail', params: {message: 'Zut ca ne marche pas..!', error: error}}
    }else{
      //console.log("REST : taille de result "+ result.length);
      reponse =  {status: 'success', params: {message: "C'est envoyé.. mais peut être tout a planté? :D", result: result}};
    }
  });
  this.response.end(JSON.stringify(
    reponse
  ));
 // this.response.end('Found some posts...  ' + JSON.stringify(
 //   reponse
 // ));
}, {where: 'server'});



// api:      http://localhost:3000/api/blogs
// example:  http://localhost:3000/api/blogs
Router.route('/api/image', function(){
  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  console.log("REST : image : On recoit les informations suivantes "+Object.keys(this.request.body));
  var reponse = "";
  Meteor.call('imageCopy',this.request.body, function(error, result) {
    if(error){
      reponse = {status: 'fail', params: {message: 'Zut ca ne marche pas..!', error: error}}
    }else{
      //console.log("REST : taille de result "+ result.length);
      reponse =  {status: 'success', params: {message: "C'est envoyé.. mais peut être tout a planté? :D", result: result}};
    }
  });
  this.response.end(JSON.stringify(
    reponse
  ));
 // this.response.end('Found some posts...  ' + JSON.stringify(
 //   reponse
 // ));
}, {where: 'server'});




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
    return {
      post: Posts.findOne(this.params._id),
  }
},

  action: function () {
    this.render('postEditHeader', {to: 'layout--header'});
    this.render('postEdit', {to: 'layout--main'});
  },
  onAfterAction: function () {
      // On met dans la session l'image actuelle et on reinitialise la valeur de session imageToDelete
      var editedPost = Posts.findOne(this.params._id);
      Session.set('imageId', editedPost.imageId);
      Session.set('imagesToDelete', []);
      Session.set('imageToAdd', false);
      //delete Session.keys['imageToDelete'];
  }
});


Router.route('/journal/:_id/edit', {
  name: 'blogEdit',

  waitOn: function () {
    return Meteor.subscribe('authors', this.params._id);
  },

  data: function () {
    return { 
      blog: Blogs.findOne(this.params._id),
    }
  },

  action: function () {
    this.render('blogEditHeader', {to: 'layout--header'});
    this.render('blogEdit', {to: 'layout--main'});
  }
});


Router.route('/submit', {
  name: 'blogSubmit',

  data: function() {
    return {
      // Header parameters
      header_backButton: true,
      header_backButtonText: true
    }
  },

  action: function () {
    this.render('header', {to: 'layout--header'});
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