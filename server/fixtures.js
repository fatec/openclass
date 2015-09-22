

if (Blogs.find().count() === 0) {
  var now = new Date().getTime();

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
    profile: { name: 'beebox.one' }
  });
  var example = Meteor.users.findOne(exampleId);

  
  var firstBlogId = Blogs.insert({
    title: 'Exemple de journal',
    userId: example._id,
    author: example.profile.name,
    submitted: new Date(now - 7 * 3600 * 1000),
  });

  Posts.insert({
    blogId: firstBlogId,
    userId: example._id,
    author: example.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'Voici votre première publication !',
    //tags: "coool"
    tags: ["exemple"]
  });

  Tags.insert({
    name: "exemple",
    blogId: firstBlogId,
    nRefs: 1
  });

  Authors.insert({
  name: "Invité",
  blogId: firstBlogId,
  nRefs: 0
});

  Authors.insert({
  name: "Enseignant",
  blogId: firstBlogId,
  nRefs: 0  
});

}



