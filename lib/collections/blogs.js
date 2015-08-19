Blogs = new Mongo.Collection('blogs');

Blogs.allow({
  update: function(userId, blog) { return ownsDocument(userId, blog); },
  remove: function(userId, blog) { return ownsDocument(userId, blog); },
});

Blogs.deny({
  update: function(userId, blog, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title').length > 0);
  }
});

Meteor.methods({
    blogInsert: function(blogAttributes) {
        check(Meteor.userId(), String);
        check(blogAttributes, {
            title: String
        });

        var user = Meteor.user();
        var blog = _.extend(blogAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date()
        });

        var blogId = Blogs.insert(blog);

        return {
            _id: blogId
        };
    }
});