Codes = new Mongo.Collection('codes'); // Store all blog codes

// TODO : add server-side security

Codes.allow({

	insert: function() {return true},

	remove: function() {return true},

	update: function() {return true}
});