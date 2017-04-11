BlogsListController = RouteController.extend({

	waitOn: function() {
      	Meteor.subscribe('blogs');
      	Meteor.subscribe('codes');
	},

  	action: function () {
    // this.render('blogsHeader', {to: 'layout--header'});
    //this.render('blogsList', {to: 'layout--main'});
    this.render();

	},
	fastRender: true
});