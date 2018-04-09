// ###### General router configuration ######

Router.configure({
	loadingTemplate: 'loading',
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	trackPageView: true
});


Router.configureBodyParsers = function() {
	Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
		extended: true,
		limit: '50mb'
	}));
};


// Auto-close slide menu on route stop (when navigating to a new route)
Router.onStop(function () {
	if (typeof slideout != 'undefined')
		slideout.close();
});


// ###### Router security hooks ######

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
					this.render('accessDenied');
				}
		} else {
				this.next();
		}
}

Router.onBeforeAction(requireLogin, {only: 'blogSubmit'});
Router.onBeforeAction(requireAdmin, {only: 'admin'});


// ###### Routes without controller ######

Router.route('/privacy', {
	name: 'privacy',
	yieldTemplates: {
		'headerBackButton': {to: 'layout--header'},
		'privacy': {to: 'layout--main'}
	},
	fastRender: true
});

Router.route('/submit', {
	name: 'blogSubmit',
	yieldTemplates: {
		'header': {to: 'layout--header'},
		'blogSubmit': {to: 'layout--main'}
	},
	fastRender: true
});

Router.route('/login', {
	name: 'login',
	yieldTemplates: {
		'loginHeader': {to: 'layout--header'},
		'login': {to: 'layout--main'}
	},
	fastRender: true
});

Router.route('/logout', {
	name: 'logout',
	yieldTemplates:{
		'headerBackButton': {to: 'layout--header'},
		'logout': {to: 'layout--main'}
	},
	fastRender: true
});

Router.route('/register', {
	name: 'register',
	yieldTemplates: {
		'registerHeader': {to: 'layout--header'},
		'register': {to: 'layout--main'}
	},
	fastRender: true
});


// ###### Routes with controller ######

Router.route('/admin', {
	name: 'admin', 
	yieldTemplates: {
		'admin': {to: 'layout--main'}
	},
	controller: 'AdminController' 
});

Router.route('/journal/:_id/edit/authors', {
	name: 'blogEditAuthors',
	yieldTemplates: {
		'blogEditAuthors': {to: 'layout--main'}
	},
	controller: 'BlogEditAuthorsController'
});

Router.route('/journal/:_id/edit/categories', {
	name: 'blogEditCategories',
	yieldTemplates: {
		'blogEditCategories': {to: 'layout--main'}
				},
	controller: 'BlogEditCategoriesController'
});

Router.route('/journal/:_id/edit', {
	name: 'blogEdit',
	yieldTemplates: {
		'blogEdit': {to: 'layout--main'}
	},
	controller: 'BlogEditController' 
});

Router.route('/', {
	name: 'indexStudent',
	yieldTemplates: {
		'indexStudent': {to: 'layout--main'}
	},
	controller: 'IndexStudentController'
});

Router.route('/teacher', {
	name: 'indexTeacher',
	yieldTemplates: {
		'indexTeacher': {to: 'layout--main'}
	},
	controller: 'IndexTeacherController'
});

Router.route('/journal/:_id', {
	name: 'blogPage',
	yieldTemplates: {
		'blogPage': {to: 'layout--main'}
	},
	controller: 'BlogPageController'
});

Router.route('/journal/:_id/users', {
	name: 'blogUsers',
	yieldTemplates: {
		'blogUsers': {to: 'layout--main'}
	},
	controller: 'BlogUsersController'
});

Router.route('/publication/:_id/edit',{
	name: 'postEdit',
	yieldTemplates: {
		'postEdit': {to: 'layout--main'}
	},
	controller: 'PostEditController'
});

Router.route('/journal/:_id/submit', {
	name: 'postSubmit',
	yieldTemplates: {
		'postSubmit': {to: 'layout--main'}
	},
	controller: 'PostSubmitController'
});

Router.route('/reset-password/:token', {
	name: 'resetPassword',
	yieldTemplates: {
		'loginHeader': {to: 'layout--header'},
		'resetPassword': {to: 'layout--main'}
	},
	controller: 'ResetPasswordController'
});


// ###### APIs ######

Router.route('/api/blogs', function() {

	this.response.statusCode = 200;
	this.response.setHeader("Content-Type", "application/json");
	this.response.setHeader("Access-Control-Allow-Origin", "*");
	this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var reponse = "";

	Meteor.call('doesBlogExist',this.request.body, function(error, result) {
		if (error) {
			reponse = {status: 'fail', params: {message: 'Error : ', error: error}};
		} else {
			reponse =  {status: 'success', params: {message: "Sended : ", result: result}};
		}
	});

	this.response.end(JSON.stringify(reponse));
}, {where: 'server'});


Router.route('/api/posts', function(){ 

	this.response.statusCode = 200;
	this.response.setHeader("Content-Type", "application/json");
	this.response.setHeader("Access-Control-Allow-Origin", "*");
	this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var reponse = "";

	Meteor.call('blogCopy',this.request.body, function(error, result) {
		if (error) {
			reponse = {status: 'fail', params: {message: 'Error : ', error: error}};
		} else {
			reponse =  {status: 'success', params: {message: "Sended : ", result: result}};
		}
	});

	this.response.end(JSON.stringify(reponse));
}, {where: 'server'});


Router.route('/api/image', function() {

	this.response.statusCode = 200;
	this.response.setHeader("Content-Type", "application/json");
	this.response.setHeader("Access-Control-Allow-Origin", "*");
	this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var reponse = "";

	Meteor.call('imageCopy',this.request.body, function(error, result) {
		if (error) {
			reponse = {status: 'fail', params: {message: 'Error : ', error: error}};
		} else {
			reponse =  {status: 'success', params: {message: "Sended : ", result: result}};
		}
	});
	this.response.end(JSON.stringify(reponse));
}, {where: 'server'});