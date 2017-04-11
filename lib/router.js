// General router configuration
Router.configure({
  loadingTemplate: 'loading',
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound'
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


// ###### Routes ######

//Router.route('/hotspot-detect.html', {    controller: 'BlogsListController' });


// ###### Router controllers ######

Router.route('/login', { name: 'login', yieldTemplates: {
    'loginHeader': {to: 'layout--header'},
    'login': {to: 'layout--main'}
        }, controller: 'LoginController' });

Router.route('/logout', { name: 'logout', yieldTemplates: {
    'logoutHeader': {to: 'layout--header'},
    'logout': {to: 'layout--main'}
        }, controller: 'LogoutController' });

Router.route('/register', { name: 'register', yieldTemplates: {
    'registerHeader': {to: 'layout--header'},
    'register': {to: 'layout--main'}
        }, controller: 'RegisterController' });

Router.route('/reset-password/:token', { name: 'resetPassword', yieldTemplates: {
    'loginHeader': {to: 'layout--header'},
    'resetPassword': {to: 'layout--main'}
        }, controller: 'ResetPasswordController' });

Router.route('/admin', { name: 'admin', yieldTemplates: {
    'header': {to: 'layout--header'},
    'admin': {to: 'layout--main'}
        }, controller: 'AdminController' });

//Router.route('/account', { name: 'accountEdit', controller: 'AccountEditController' });

Router.route('/', { name: 'blogsList', yieldTemplates: {
    'blogsHeader': {to: 'layout--header'},
    'blogsList': {to: 'layout--main'}
        }, controller: 'BlogsListController' });

Router.route('/journal/:_id', { name: 'blogPage', yieldTemplates: {
    'mobileMenu': {to: 'layout--menu'},
    'postsHeader': {to: 'layout--header'},
    'blogPage': {to: 'layout--main'}
        }, controller: 'BlogPageController' });

Router.route('/journal/:_id/users', { name: 'blogUsers', yieldTemplates: {
    'blogEditHeader': {to: 'layout--header'},
    'blogUsers': {to: 'layout--main'}
        }, controller: 'BlogUsersController' });

Router.route('/journal/:_id/submit', { name: 'postSubmit', yieldTemplates: {
    'postSubmitHeader': {to: 'layout--header'},
    'postSubmit': {to: 'layout--main'}
        }, controller: 'PostSubmitController' });

Router.route('/publication/:_id/edit', { name: 'postEdit', yieldTemplates: {
    'postEditHeader': {to: 'layout--header'},
    'postEdit': {to: 'layout--main'}
        }, controller: 'PostEditController' });

Router.route('/journal/:_id/edit', { name: 'blogEdit', yieldTemplates: {
    'blogEditHeader': {to: 'layout--header'},
    'blogEdit': {to: 'layout--main'}
        }, controller: 'BlogEditController' });

Router.route('/journal/:_id/edit/authors', { name: 'blogEditAuthors', yieldTemplates: {
    'blogEditHeader': {to: 'layout--header'},
    'blogEditAuthors': {to: 'layout--main'}
        }, controller: 'BlogEditAuthorsController' });

Router.route('/journal/:_id/edit/categories', { name: 'blogEditCategories', yieldTemplates: {
    'blogEditHeader': {to: 'layout--header'},
    'blogEditCategories': {to: 'layout--main'}
        }, controller: 'BlogEditCategoriesController' });

Router.route('/submit', { name: 'blogSubmit', yieldTemplates: {
    'header': {to: 'layout--header'},
    'blogSubmit': {to: 'layout--main'}
        }, controller: 'BlogSubmitController' });
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

