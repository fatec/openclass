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
					this.render('spacesHeader', {to: 'layout--header'});
					this.render('accessDenied');
				}
		} else {
				this.next();
		}
}

Router.onBeforeAction(requireLogin, {only: 'spaceSubmit'});
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
	name: 'spaceSubmit',
	yieldTemplates: {
		'header': {to: 'layout--header'},
		'spaceSubmit': {to: 'layout--main'}
	},
	fastRender: true
});

Router.route('/update', {
	name: 'update',
	yieldTemplates: {
		'loginHeader': {to: 'layout--header'},
		'update': {to: 'layout--main'}
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
	name: 'spaceEditAuthors',
	yieldTemplates: {
		'spaceEditAuthors': {to: 'layout--main'}
	},
	controller: 'SpaceEditAuthorsController'
});

Router.route('/journal/:_id/edit/categories', {
	name: 'spaceEditCategories',
	yieldTemplates: {
		'spaceEditCategories': {to: 'layout--main'}
				},
	controller: 'SpaceEditCategoriesController'
});

Router.route('/journal/:_id/edit', {
	name: 'spaceEdit',
	yieldTemplates: {
		'spaceEdit': {to: 'layout--main'}
	},
	controller: 'SpaceEditController' 
});

Router.route('/', {
	name: 'spaceList',
	yieldTemplates: {
		'spaceList': {to: 'layout--main'}
	},
	controller: 'SpaceListController'
});

Router.route('/journal/:_id', {
	name: 'spacePage',
	yieldTemplates: {
		'spacePage': {to: 'layout--main'}
	},
	controller: 'SpacePageController'
});

Router.route('/journal/:_id/users', {
	name: 'spaceUsers',
	yieldTemplates: {
		'spaceUsers': {to: 'layout--main'}
	},
	controller: 'SpaceUsersController'
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

Router.route('/api/spaces', function() {

	this.response.statusCode = 200;
	this.response.setHeader("Content-Type", "application/json");
	this.response.setHeader("Access-Control-Allow-Origin", "*");
	this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var reponse = "";

	Meteor.call('doesSpaceExist',this.request.body, function(error, result) {
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

	Meteor.call('spaceCopy',this.request.body, function(error, result) {
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