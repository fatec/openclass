Blogs = new Mongo.Collection('blogs');

Blogs.allow({

	update: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); },

	remove: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); }
});


if(Meteor.isServer) {

	Blogs.before.update(function (userId, doc, fieldNames, modifier, options) {

		modifier.$set = modifier.$set || {};
		modifier.$set.modified = Date.now();

		// change modified date
		doc.version =  doc.version++;
		doc.modified = Date.now();
	});

	Blogs.before.insert(function (userId, doc) {
		// change modified date
		doc.submitted =  Date.now();
	});


	Meteor.methods({

		getBlogId: function(blogCode) {
			if (Blogs.findOne({blogCode:blogCode}))
				return Blogs.findOne({blogCode:blogCode})._id;
			else
				return null;
		},
		updateCode: function(oldCode, newCode) {
			var codeId = Codes.findOne({code: oldCode})._id;
			Codes.update(codeId,{code:newCode}, function(error) {
				if (error) {
					console.log("Error when changing code : "+error.message);
				}
				else {
					console.log("Code has been changed.");
				}
			})
		},
		deleteBlog: function(blogId) {
				Blogs.remove(blogId);
				Posts.remove({blogId:blogId});
		},
		blogInsert: function(blogAttributes) {

			check(blogAttributes, {
					title: String
			});

			var nbOfCodes = Codes.find().count();
			var prefix = Meteor.settings.public.prefix;
			var codeLength = 4;

			if (nbOfCodes <= 1000)
				codeLength = 2;
			else if (nbOfCodes > 1000 && nbOfCodes <= 100000)
				codeLength = 3;
			else if (nbOfCodes > 100000 && nbOfCodes <= 10000000)
				codeLength = 4;

			var code = prefix + makeCode(codeLength);
			while (typeof Codes.findOne({code: code}) != 'undefined')
				code = prefix + makeCode(codeLength);

			Codes.insert({code:code, userId:Meteor.userId()});

			var user = Meteor.user();
			var blog = _.extend(blogAttributes, {
				userId: user._id,
				blogCode: code,
				submitted: new Date(),
				visible: true,
				codePanel: true,
				guestWrite: true,
				commentsAllowed:true,
				postEditPermissions:"own",
				createUserAllowed:true
			});

			var blogId = Blogs.insert(blog);

			Meteor.call('authorInsert', 'Invité', blogId );

			return { _id: blogId };
		}
	});
}


function makeCode(length)
{
	var text = "";
	var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";

	for( var i=0; i < length; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	return text;
}