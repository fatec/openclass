// TODO faire un callback pour effacer tous les posts après avoir effacé un journal (ainsi que les images associées mais ca c'est dans le callback du post)


Blogs = new Mongo.Collection('blogs');

Blogs.allow({
  update: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); },
  remove: function(userId, blog) { return ownsDocument(userId, blog) || isAdmin(userId); },
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
    },
    // Meteor.call('sendBlog', {blogId: this._id} );
    sendBlog: function(blogAttributes) {
      // On peut vérifier que celui qui a cliqué sur le bouton est le owner du journal ou un admin      
      check(blogAttributes, {
          blogId: String
      });
      var blog = Blogs.findOne(blogAttributes.blogId);
      var posts = Posts.find({blogId: blog._id});
      console.log("On aimerait envoyer le jounal "+blog.title+" et ses "+posts.count()+" posts");
      console.log("blog "+blog);
      console.log("posts "+posts);

// #############
 var result = Meteor.http.call("POST",  "http://129.194.30.228:3000/api/blogs/",
 {data:{"title" : blog.title, "_id": blog._id},headers:{"content-type":"application/json"}}, function      (error,result) {
              console.log(result);
            });
// #############

    },
    blogCopy: function(blogAttributes) {
      check(blogAttributes, {
        _id: String
      })
    }
});


if (Meteor.isServer) {

  // Global API configuration
  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

  Api.addCollection(Blogs, {
    excludedEndpoints: ['getAll', 'put', 'delete'],
    routeOptions: {
      authRequired: false
    },
    endpoints: {
      post: {
        authRequired: false, 
        action: function () {
          /*
          console.log("queryParams "+Object.keys(this.queryParams));
          console.log("bodyParams "+Object.keys(this.bodyParams));
          console.log("action "+Object.keys(this.action));
          console.log("request "+Object.keys(this.request));
          console.log("urlParams "+Object.keys(this.urlParams));
          */
          var blogId = this.bodyParams._id;
          var title = this.bodyParams.title;
          var blog  = Blogs.findOne(blogId);
          if (blog) {
            console.log("Il y a deja le blog "+blog.title);
          return {status: 'success', data: {message: 'Rien envoyé car il y a deja un blog avec cet id'}};
          } else {
            console.log("On ajoute le blog "+blog.title);
            if (Meteor.call('blogInsert',{title: title})) {          
              return {status: 'success', data: {message: 'Est ce que ca a marché?'}};
            } else {
              return {status: 'fail', message: 'on a pas réussi a inserer le blog'}
            }
          }
        }
      }
    }
  });

  // Generates: GET, POST on /api/items and GET, PUT, DELETE on
  // /api/items/:id for the Items collection
  //Api.addCollection(Blogs);

  // Generates: POST on /api/users and GET, DELETE /api/users/:id for
  // Meteor.users collection
  /*
  Api.addCollection(Meteor.users, {
    excludedEndpoints: ['getAll', 'put'],
    routeOptions: {
      authRequired: true
    },
    endpoints: {
      post: {
        authRequired: false
      },
      delete: {
        roleRequired: 'admin'
      }
    }
  });
  */

  // Maps to: /api/articles/:id
/*
  Api.addRoute('articles/:id', {authRequired: true}, {
    get: function () {
      return Articles.findOne(this.urlParams.id);
    },
    delete: {
      roleRequired: ['author', 'admin'],
      action: function () {
        if (Articles.remove(this.urlParams.id)) {
          return {status: 'success', data: {message: 'Article removed'}};
        }
        return {
          statusCode: 404,
          body: {status: 'fail', message: 'Article not found'}
        };
      }
    }
  });
*/
}


/*

Blogs.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  userId: {
    type: String,
    label: "UserId"
  },
  author: {
    type: String,
    label: "Author name",
    max: 200
  },
  submitted: {
        type: Date,
        label: "Submission date"
  },
  modified: {
        type: Date,
        label: "Last modification date",
        optional: true
  }
}));
*/
