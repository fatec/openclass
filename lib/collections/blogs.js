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


if(Meteor.isServer) {

fs = Npm.require('fs');
// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data

    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}



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
    // Send blog from Box to main Server
    sendBlog: function(blogAttributes) {
      // On peut vérifier que celui qui a cliqué sur le bouton est le owner du journal ou un admin
      check(blogAttributes, {
          blogId: String
      });

      var blog  = Blogs.findOne(blogAttributes.blogId);
      var posts = Posts.find({blogId: blogAttributes.blogId}).fetch();
      var tags = Tags.find({blogId: blogAttributes.blogId}).fetch();
      var images = Images.find({'metadata.blogId': blogAttributes.blogId}).fetch();

// Essai de remote connect avec DDP et FS Collection
// var remote = DDP.connect('http://129.194.30.228:3000/');


// On recupère l'ID et on demande un base64 de cette image


var fs;
if(Meteor.isServer) {

      //fs = Npm.require('fs');

      var postItem = 0;
      while (postItem < posts.length) {
        if (posts[postItem].imageId) {
          console.log("le post "+posts[postItem].body+" a une image "+posts[postItem].imageId._id);
          //var blob = Images.retrieveBuffer(posts[postItem].imageId._id);
          var imageToCopy = Images.findOne(posts[postItem].imageId._id);
          var file = process.env.PWD+"/.meteor/local/cfs/files/images/"+imageToCopy.copies.images.key;
          console.log("le path de l'image est "+file);

          var base64image = base64_encode(file)
          _.extend(posts[postItem], {imageData: base64image, imageName: imageToCopy.copies.images.key});
          // essai pour ecrire une image:
          //console.log(ejsonImage);
          //fs.writeFileSync("/Users/morands/Downloads/fs.jpg", JSON.parse(ejsonImage));
          //base64_decode(base64image, "/Users/morands/Downloads/monImage.jpg")

        }
        postItem++;
      }

}



/*
      var imageItem = 0;
      while (imageItem < images.length) {
          console.log("     données de l'image: "+ Object.keys(images[imageItem]))
          var file = process.env.PWD+"/.meteor/local/cfs/files/images/"+images[imageItem].copies.images.key;
          console.log("le path de l'image est "+file);


          var fs = Npm.require('fs');
          var data = fs.readFileSync(file, 'binary');
          var ejsonImage = EJSON.stringify({ imageData: data });
          console.log("################ ejsonImage "+ejsonImage);

          imageItem++;
      }
      */

       //   var imgData = new FS.File(file);

          // On transforme en base64
          //var imgData = JSON.stringify(CSVfile);
       //   console.log("base64 de l'image "+imgData);

//################## Upload de l'image
/*

Regarder ici:
https://github.com/CollectionFS/Meteor-CollectionFS/issues/457

   var newFile = new FS.File(file);
      //newFile.metadata = {blogId: template.data.blog._id, timestamp: template.data.timestamp};
      newFile.metadata = {blogId: blogAttributes.blog._id};
      // TODO On ajoute le timestamp a l'image pour retrouver l'image lorsque l'on envoie le formulaire et la lier au post

      imageId = Images.insert(newFile, function (err, fileObj) {
        console.log("On ajoute l'image Id dans la session: "+imageId._id);
      });
*/
//##################
//asd


      var user = this.userId;

      console.log("CLIENT : On aimerait envoyer le jounal "+blog.title+" et ses "+posts.length+" posts");

      // Le data qu'on veut envoyer:


// #############
// var result = Meteor.http.call("POST",  "http://129.194.30.228:3000/api/blogs/",
 var result = Meteor.http.call("POST",  "http://129.194.30.228:3000/api/blogs/",
 {data:{blog: blog, posts: posts, images: images, tags: tags, userDoingCopy: user},headers:{"content-type":"application/json"}}, function      (error,result) {
              //console.log(result);
            });
// #############

    },
    // Receive from Box and copy in mainServer
    blogCopy: function(blogAttributes) {
      console.log("On reçoit les informations suivantes: "+Object.keys(blogAttributes));
      //  0,1,_id,title,userId,author,submitted,postSize,userDoingCopy

      console.log("##########");
      console.log("##########");
      console.log("Il y a "+blogAttributes.posts.length+" posts dans le blog "+blogAttributes.blog.title);
      console.log("Le propriétaire du blog est "+blogAttributes.blog.userId);
      console.log("Dans les posts il y a "+Object.keys(blogAttributes.posts));
      console.log("Il y a "+blogAttributes.posts.length);
     /* if (Users.findOne(blogAttributes.userId)) {
        console.log("l'utilisateur existe")
      } else {
        console.log("l'utilisateur n'existe pas.. Il faudra changer le propriétaire du blog")
      }*/
      var postItem = 0;
      while (postItem < blogAttributes.posts.length) {
          console.log("     contenu du post: "+ blogAttributes.posts[postItem].body)
          // regarder si image id et si oui inserer image puis changer l'id pour l'id précedent.. (beark)
          console.log("     Et les keys du post: "+ Object.keys(blogAttributes.posts[postItem]))
          if (blogAttributes.posts[postItem].imageData) {
            base64_decode(blogAttributes.posts[postItem].imageData, "/Users/hildesteph/Downloads/"+blogAttributes.posts[postItem].imageName)
          }

          postItem++;
      }


      var imageItem = 0;
      while (imageItem < blogAttributes.images.length) {
          console.log("     données de l'image: "+ Object.keys(blogAttributes.images[imageItem]))
          var file = "./public/cfs/files/images/"+blogAttributes.images[imageItem].copies.images.key;
          console.log("le path de l'image est "+file);
          //console.log("le chemin du process est "+process.env.PWD);

//################## Upload de l'image
/*

   var newFile = new FS.File(file);
      //newFile.metadata = {blogId: template.data.blog._id, timestamp: template.data.timestamp};
      newFile.metadata = {blogId: blogAttributes.blog._id};
      // TODO On ajoute le timestamp a l'image pour retrouver l'image lorsque l'on envoie le formulaire et la lier au post

      imageId = Images.insert(newFile, function (err, fileObj) {
        console.log("On ajoute l'image Id dans la session: "+imageId._id);
      });
*/
//##################


          imageItem++;
      }


      var tagItem = 0;
      while (tagItem < blogAttributes.tags.length) {
          console.log("     données du tag: "+ Object.keys(blogAttributes.tags[tagItem]))
          tagItem++;
      }


      console.log("##########");
      console.log("##########");
    }
});
}

/*
Pour la synchronisation:
- CLIENT : envoie une demande de synchro avec blogId, title
- SERVER : reponds une liste postId, lastEditionDate avec la liste des posts qui existent deja
- CLIENT : renvoie la liste des posts à mettre à jour (tous si la liste du serveur est vide) selon reglage : ecraser, merge le content (pas possible avec les images), ne rien faire
- SERVER : reponds success

Question API REST - tout sur la même interface ou alors une interface api/blogs api/posts
-> si plusieurs différentes comme cela on peut choisir de mettre à jour simplement un post?
*/

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
          console.log("SERVER : On recoit les informations suivantes "+Object.keys(this.bodyParams));
          if ( Meteor.call('blogCopy',this.bodyParams)) {
            return {status: 'success', data: {message: "C'est envoyé.. mais peut être tout a planté? :D"}};
          } else {
            return {status: 'fail', message: 'Zut ca ne marche pas..!'}
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
