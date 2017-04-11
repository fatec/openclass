AdminController = RouteController.extend({

  	waitOn: function () {
    	return [
      		Meteor.subscribe('allUsers')
       	];
  	},  	

  	action: function () {
    //this.render('header', {to: 'layout--header'});
    //this.render('admin', {to: 'layout--main'});
    this.render();

	},
	  fastRender: true
});