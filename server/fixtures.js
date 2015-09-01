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
  
// Create users
  var users = [
   // Create admin user
      {username:"admin",password:"admin",roles:['admin']},
  ];

  _.each(users, function (user) {
    var id;

    id = Accounts.createUser({
      username: user.username,
      password: user.password,
    });

    if (user.roles.length > 0) {
      // Need _id of existing user record so this call must come 
      // after `Accounts.createUser` or `Accounts.onCreate`
      Roles.addUsersToRoles(id, user.roles);
    }

  });


  // Create example user
  var exampleId = Meteor.users.insert({
    profile: { name: 'bzzbox' }
  });
  var example = Meteor.users.findOne(exampleId);

  
  var firstBlogId = Blogs.insert({
    title: 'Exemple de journal',
    userId: example._id,
    author: example.profile.name,
    submitted: new Date(now - 7 * 3600 * 1000),
  });

    var secondBlogId = Blogs.insert({
    title: 'Autre example pour le developpement',
    userId: example._id,
    author: example.profile.name,
    submitted: new Date(now - 7 * 3600 * 1000),
  });


  Posts.insert({
    blogId: secondBlogId,
    userId: example._id,
    author: example.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'Un publication pour le blog 2',
    //tags: "coool, c'est de la balle!!!"
    tags: ["coool", "c'est de la balle!!!"]
  });
  Posts.insert({
    blogId: secondBlogId,
    userId: example._id,
    author: example.profile.name,
    submitted: new Date(now - 5 * 3600 * 500),
    body: 'Encore une autre publication pour le blog 2',
    //tags: "cool"
    tags: ["coool"]
  });

  Posts.insert({
    blogId: firstBlogId,
    userId: example._id,
    author: example.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'Voici votre première publication !',
    //tags: "coool"
    tags: ["coool"]
  });

  var tags = [
    {
      name: "coool",
      blogId: firstBlogId,
      nRefs: 1
    },
    {
      name: "coool",
      blogId: secondBlogId,
      nRefs: 2
    },
    {
      name: "c'est de la balle!!!",
      blogs: secondBlogId,
      nRefs: 1
    }
  ];


}



