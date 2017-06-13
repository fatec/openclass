Images = new Mongo.Collection('images'); // Store all images

// TODO : add server-side security

Images.allow({

  	insert: function() {return true},

 	remove: function() {return true},

	update: function() {return true}
});