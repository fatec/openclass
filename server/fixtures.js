if (Blogs.find().count() === 0) {
  var now = new Date().getTime();

  // create two users
  var stephId = Meteor.users.insert({
    profile: { name: 'Stéphane Morand' }
  });
  var steph = Meteor.users.findOne(stephId);
  var vincentId = Meteor.users.insert({
    profile: { name: 'Vincent Widmer' }
  });
  var vincent = Meteor.users.findOne(vincentId);
  
  
  var firstBlogId = Blogs.insert({
    title: 'Sortie au bout du monde',
    userId: steph._id,
    author: steph.profile.name,
    submitted: new Date(now - 7 * 3600 * 1000),
  });

  Posts.insert({
    blogId: firstBlogId,
    userId: steph._id,
    author: steph.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'Trop bien!'
  });

  Posts.insert({
    blogId: firstBlogId,
    userId: vincent._id,
    author: vincent.profile.name,
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'Super!! Youpi'
  });

  Blogs.insert({
    title: 'Sur le Salève',
    userId: vincent._id,
    author: vincent.profile.name,
    submitted: new Date(now - 10 * 3600 * 1000),
  });

  Blogs.insert({
    title: 'Les abeilles',
    userId: vincent._id,
    author: vincent.profile.name,
    submitted: new Date(now - 12 * 3600 * 1000),
  });

}



