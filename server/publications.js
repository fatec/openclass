Meteor.publish('blogs', function(userId) {
  return Blogs.find({userId:userId});
});

Meteor.publish('blogsVisited', function(blogsId) {
  console.log("ON a les ID : "+blogsId);
  return Blogs.find({});
});

Meteor.publish('blog', function(blogId) {
  return Blogs.find({_id: blogId});
});

Meteor.publish('blogsVersions', function() {
  return BlogsVersions.find();
});

Meteor.publish('posts', function(filters,skip,limit) {
  // TODO check data
  //check(blogId, String);
    //return Posts.find({blogId: blogId});
  return Posts.find(filters, {sort: {submitted: 1},skip:skip,limit:limit});
});

Meteor.publish('postsVersions', function(blogId) {
  check(blogId, String);
  return PostsVersions.find({blogId: blogId}, {sort: {submitted: 1}});
});

Meteor.publish('postsEdit', function(postId) {
  check(postId, String);
  return Posts.find({_id: postId});
});	

Meteor.publish('allUsers', function() {
  return Meteor.users.find();
 })

//Meteor.publish("images", function(blogId){ return Images.find({'metadata.blogId': blogId, 'metadata.last': true}); });
Meteor.publish("images", function(blogId){ return Images.find({blogId: blogId}); });
Meteor.publish("images2", function(blogId){ return Images.find();});

Meteor.publish("postImage", function(postId){ return Images.find({'metadata.postId': postId}); });
Meteor.publish("tags", function(blogId){ return Tags.find({blogId: blogId}); });
Meteor.publish("authors", function(blogId){ return Authors.find({blogId: blogId}); });
Meteor.publish("categories", function(blogId){ return Categories.find({blogId: blogId}); });
//Meteor.publish("codes", function(){ return Codes.find()});

// Meteor.publish("userStatus", function() {
//   return Meteor.users.find({ "status.online": true });
// });

// Publish the current size of a collection.
// server: publish the current size of a collection
Meteor.publish("count-all-posts", function (blogId) {
  var self = this;
  var count = 0;
  var initializing = true;

  var handle = Posts.find({blogId: blogId}).observeChanges({
    added: function (doc, idx) {
      count++;
      if (!initializing) {
                console.log("DOC :"+idx._id);

        self.changed("counts", blogId, {count: count});  // "counts" is the published collection name
      }
    },
    removed: function (doc, idx) {
      count--;
      self.changed("counts", blogId, {count: count});  // same published collection, "counts"
    }
    // don't care about moved or changed
  });

  initializing = false;

  // publish the initial count. `observeChanges` guaranteed not to return
  // until the initial set of `added` callbacks have run, so the `count`
  // variable is up to date.
  self.added("counts", blogId, {count: count});

  // and signal that the initial document set is now available on the client
  self.ready();

  // turn off observe when client unsubscribes
  self.onStop(function () {
    handle.stop();
  });
});