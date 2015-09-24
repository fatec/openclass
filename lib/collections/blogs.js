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
    // #########################
    // Meteor.call('sendBlog', {blogId: this._id} );
    // Send blog from Box to main Server
    // "Client" side of the synchronisation
    // #########################
    sendBlog: function(blogAttributes) {
      // On peut vérifier que celui qui a cliqué sur le bouton est le owner du journal ou un admin
      check(blogAttributes, {
          blogId: String
      });

      // Idée:
      // CLIENT  -> envoie  {blogID: , title: } sur Meteor.http.call("POST",  "http://129.194.238.122:3000/api/blogs/", ...)
      // SERVER  -> on cree un writestream unique (timestamp?) pour recevoir toutes les images plus tard
      //         -> reponds le handle du writestream null (le blog n'existait pas) ou [{postID, lastEditionDate:}, ... ] (le blog existait)
      //         -> 
      // CLIENT  -> choisi les posts qu'il veux envoyer (pour l'instant on envoie tout)
      //         -> on cree un tableau [{imageName: , imageData: }, ...]
      //         -> on cree un readStream que l'on envoie sur le serveur
      // SERVER  -> pour chaque post qui n'existait pas encore il ajoute le tag dans la collection avec le blogId qui correspond
      //         -> pour chaque image du 

      // Recupère les données du blog
      var serverIp = "http://129.194.30.228:3000";


      // ################
      // On envoie le blog pour voir s'il existe deja s'il existe on recoit la liste de tous les posts
      // ################
      var user = this.userId;
      var blog  = Blogs.findOne(blogAttributes.blogId);
      console.log("CLIENT - SEND BLOG : Le blog avant qu'il soit envoyé "+blog._id);
      blog = JSON.stringify(blog);
      Meteor.http.call("POST",  serverIp+"/api/blogs/",
        {params:{blog: blog, userDoingCopy: user}}, function (error,result) {
           if(error){
              console.log('CLIENT - SEND BLOG : Error http.call blogs '+error);
           }else{
              // On recoit null ou alors [{postId: , lastEditionDate: }, ...]
              // ici on peut choisir quels posts envoyer au serveur selon la date de dernière édition et leur _id
              if (result.data.params.error) {
                console.log("CLIENT - SEND BLOG : error sendBlog returned from SERVER "+result.data.params.error);
              } else if (result.data.params.result) {
                // ################
                // Le blog existe déjà sur le serveur
                // Il faut mettre à jour les posts que l'on souhaite sur le client et envoyer au serveur les posts qui doivent être modifiés
                // ################
                console.log("CLIENT - SEND BLOG : Il y a déjà un journal avec cet ID, voici le contenu des posts existant");
                var allPosts = JSON.parse(result.data.params.result);
                var postItem = 0;
                while (postItem < allPosts.length) {
                  console.log("CLIENT - SEND BLOG : Contenu du post "+postItem+": "+allPosts[postItem].body);
                  postItem++;
                };
              } else {
                console.log("CLIENT - SEND BLOG : Pas de journal sur le serveur")
              }
              // On envoie tous les posts pour l'instant pour faire simple
              var posts = Posts.find({blogId: blogAttributes.blogId}).fetch();
              var images = Images.find({'metadata.blogId': blogAttributes.blogId}).fetch();
              posts = JSON.stringify(posts);
              images = JSON.stringify(images);
              Meteor.http.call("POST",  serverIp+"/api/posts/",
                {params:{blogId: blog._id, blogTitle: blog.title,posts: posts, images: images, userDoingCopy: user}}, function (error,result) {
                  if (error) {
                    console.log('CLIENT - SEND BLOG : Error http.call posts '+error);
                  } else {
                    // tous les posts on été envoyés
                    console.log("CLIENT - SEND BLOG : Tous les posts sont envoyés");
                  }
              });

              //pour chaque posts qui a une image il faut envoyer l'image
              var images = Images.find({'metadata.blogId': blogAttributes.blogId}).forEach(function(image){
                var file = process.env.PWD+"/.meteor/local/cfs/files/images/"+image.copies.images.key;
                var base64image = base64_encode(file);
                console.log("CLIENT - SEND BLOG : On veux envoyer l'image "+image.copies.images.key);
                Meteor.http.call("POST",  serverIp+"/api/image/",
                {params:{imageData: base64image, imageName: image.copies.images.key, store: "images"}}, function (error,result) {
                  if (error) {
                    console.log('CLIENT - SEND BLOG : Error http.call image '+error);
                  } else {
                    // tous les posts on été envoyés
                  }
                });


                var file = process.env.PWD+"/.meteor/local/cfs/files/thumbs/"+image.copies.images.key;
                var base64image = base64_encode(file);
                console.log("CLIENT - SEND BLOG : On veux envoyer l'image "+image.copies.images.key);
                Meteor.http.call("POST",  serverIp+"/api/image/",
                {params:{imageData: base64image, imageName: image.copies.images.key, store: "thumbs"}}, function (error,result) {
                  if (error) {
                    console.log('CLIENT - SEND BLOG : Error http.call image '+error);
                  } else {
                    // tous les posts on été envoyés
                  }
                });




              });


            }
         }
      );
    },
    // ##############################
    // Receive : blogId blogTitle
    // Returns : null or existing [{postId: post._id, lastEditionDate: post.submitted}] 
    // ##############################
    doesBlogExist: function(blogAttributes) {
      console.log("doesBlogExist : Infos recues: "+Object.keys(blogAttributes));
      var blog = JSON.parse(blogAttributes.blog);
      console.log("SERVER - doesBlogExist : blogId: "+blog._id);
      console.log("SERVER - doesBlogExist : Titre du blog: "+blog.title);

      // On recherche s'il y a un blog qui correspond à cet id
      var serverBlog = Blogs.findOne(blog._id);
      if (serverBlog == undefined) {
        // le blog n'existe pas encore, alors on l'insert tel quel 
        // TODO decider que faire si le blog owner n'existe pas!
        console.log("SERVER - doesBlogExist : le blog n'existe pas sur le serveur");
        console.log("SERVER - doesBlogExist : est ce que le user existe ? Users.findOne("+blog.userId+");");
        var owner = Meteor.users.findOne(blog.userId);
        console.log("SERVER - doesBlogExist : owner "+owner);
        if (owner == undefined) {
          console.log("SERVER - doesBlogExist : l'utilisateur n'existe pas sur le serveur on donne cela à l'utilisateur admin.. tant pis pour vous..");
          var myBlog = Blogs.insert({_id: blog._id,title: blog.title, userId: "tmjhqqBGmDT6MNfvw",author: "copied from somewhere else!",submitted: blog.submitted});

          // Il faut ajouter le blog avec un owner qui est sur admin pour l'instant..
        } else {
          console.log("SERVER - doesBlogExist : On insert le blog car il n'était pas présent et le propriétaire existe");
          var myBlog = Blogs.insert(serverBlog);
        }
        return null;
      } else {
        console.log("SERVER - doesBlogExist : Le blog existe déjà sur le serveur");
        // TODO : On renomme le blog s'il a changé de nom (en comparant modification date)
        var allPosts = Posts.find({blogId: blog._id}).fetch();
        allPosts = JSON.stringify(allPosts);
        console.log("SERVER - doesBlogExist : Le blog existe déja.. on revoie tout les posts "+allPosts);
        return allPosts;

      }
    },
    blogCopy: function(blogAttributes) {
      //console.log("BlogCopy : Infos recues: "+Object.keys(blogAttributes));
      var posts = JSON.parse(blogAttributes.posts);
      var postItem = 0;
      while (postItem < posts.length) {
        console.log("SERVER - BlogCopy : Contenu du post "+postItem+": "+posts[postItem].body);
        // Si le post existe deja on l'update
        // Si il n'existe pas on le crée
          Posts.upsert(posts[postItem]._id, {$set: posts[postItem]});
        postItem++;
      };

      var images = JSON.parse(blogAttributes.images);
      console.log("SERVER - BlogCopy : Contenu de images "+images[0]);
      var imageItem = 0;
      while (imageItem < images.length) {
        // Si l'image existe deja on l'update
        // Si elle n'existe pas on le crée
          Images.upsert(images[imageItem]._id, {$set: images[imageItem]});
        postItem++;
      };


    },
    imageCopy: function(blogAttributes) {
      console.log("SERVER - imageCopy : Infos recues: "+Object.keys(blogAttributes));
      console.log("SERVER - imageCopy : Nom de l'image: "+blogAttributes.imageName);
      var path = process.env.PWD+"/.meteor/local/cfs/files/"+blogAttributes.store+"/"+blogAttributes.imageName;
      console.log("SERVER - imageCopy : chemin "+path);
      base64_decode(blogAttributes.imageData, process.env.PWD+"/.meteor/local/cfs/files/"+blogAttributes.store+"/"+blogAttributes.imageName)

    }

   //   return [{postId: "post1", lastEditionDate: "1 janvier 2012"}, {postId: "post2", lastEditionDate: "3 mai 2014"}, {postId: "post3", lastEditionDate: "12 avril 2015"}];
  /*    console.log("Il y a "+blogAttributes.posts.length+" posts dans le blog "+blogAttributes.blog.title);
      console.log("Le propriétaire du blog est "+blogAttributes.blog.userId);
      console.log("Dans les posts il y a "+Object.keys(blogAttributes.posts));
      console.log("Il y a "+blogAttributes.posts.length);
      if (Users.findOne(blogAttributes.userId)) {
        console.log("l'utilisateur existe")
      } else {
        console.log("l'utilisateur n'existe pas.. Il faudra changer le propriétaire du blog")
      }*/
/*      var postItem = 0;
      while (postItem < blogAttributes.posts.length) {
          console.log("     contenu du post: "+ blogAttributes.posts[postItem].body)
          // regarder si image id et si oui inserer image puis changer l'id pour l'id précedent.. (beark)
          console.log("     Et les keys du post: "+ Object.keys(blogAttributes.posts[postItem]))
          if (blogAttributes.posts[postItem].imageData) {
            base64_decode(blogAttributes.posts[postItem].imageData, "/Users/morands/Downloads/"+blogAttributes.posts[postItem].imageName)
          }


          postItem++;
      }


      var imageItem = 0;
      while (imageItem < blogAttributes.images.length) {
          console.log("     données de l'image: "+ Object.keys(blogAttributes.images[imageItem]))
          var file = "./public/cfs/files/images/"+blogAttributes.images[imageItem].copies.images.key;
          console.log("le path de l'image est "+file);
 */         //console.log("le chemin du process est "+process.env.PWD);

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

/*
          imageItem++;
      }


      var tagItem = 0;
      while (tagItem < blogAttributes.tags.length) {
          console.log("     données du tag: "+ Object.keys(blogAttributes.tags[tagItem]))
          tagItem++;
      }

*/
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
/*
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
/*
          
          console.log("REST : SERVER : On recoit les informations suivantes "+Object.keys(this.bodyParams));
          var reponse = "";
          Meteor.call('blogCopy',this.bodyParams, function(error, result) {
            if(error){
              reponse = {status: 'fail', data: {message: 'Zut ca ne marche pas..!', error: error}}
            }else{
              console.log("REST : result "+ result);
              reponse =  {status: 'success', data: {message: "C'est envoyé.. mais peut être tout a planté? :D", result: result}};
            }
          });
          
          return reponse;*/
/*
          if ( Meteor.call('blogCopy',this.bodyParams)) {
            return {status: 'success', data: {message: "C'est envoyé.. mais peut être tout a planté? :D"}};
          } else {
            return {status: 'fail', message: 'Zut ca ne marche pas..!'}
          }
*/

/*
        }
      }
    }
  });*/

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
//}





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
