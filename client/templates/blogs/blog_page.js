Template.blogPage.onCreated(function() {



  viewport = document.querySelector("meta[name=viewport]");
viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=4');


  var blogId = this.data.blog._id;
    Session.set('author','');
    Session.set('tag','');
    Session.set('category','');

    //Session.set('isReactive',false);
    Session.set('nbPosts', Posts.find({}).fetch().length);
});


Template.blogPage.helpers({

  posts: function() {

    if (this.blog !== undefined) {

      if (Session.get('isReactive')) {

        if (Session.get('author') !== "") {
          return Posts.find({author:Session.get('author')},{sort: {submitted: -1}});
        }
        else if (Session.get('category') !== "") {
          return Posts.find({category:Session.get('category')},{sort: {submitted: -1}});
        }
        else if (Session.get('tag') !== "") {
          return Posts.find({tags:Session.get('tag')},{sort: {submitted: -1}});
        }
        else {
          return Posts.find({},{sort: {submitted: -1}});
        }        

      } else {

        if (Session.get('author') !== "") {
          var newMessages = Posts.find({author:Session.get('author')}).fetch().length - Session.get("nbPosts");
          return Posts.find({author:Session.get('author')},{sort: {submitted: -1},skip:newMessages});
        }
        else if (Session.get('category') !== "") {
          var newMessages = Posts.find({category:Session.get('category')}).fetch().length - Session.get("nbPosts");
          return Posts.find({category:Session.get('category')},{sort: {submitted: -1},skip:newMessages});
        }
        else if (Session.get('tag') !== "") {
          var newMessages = Posts.find({tags:Session.get('tag')}).fetch().length - Session.get("nbPosts");
          return Posts.find({tags:Session.get('tag')},{sort: {submitted: -1},skip:newMessages});
        }
        else {
          var newMessages = Posts.find({}).fetch().length - Session.get("nbPosts");
          return Posts.find({},{sort: {submitted: -1},skip:newMessages});
      }
    }
  } else
    return null;
},
  postCount: function() { // return the number of posts
    //return Posts.find().count();
  },
  codePanelState: function() {
    return (this.blog.codePanel)
  },
    ownBlog: function() {
    if (this.blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
        return true;
    },
    newMessages: function() {
    if (!Session.get('isReactive'))
    {
      var nbPosts = Session.get('nbPosts');
      var postsReactiveCount;

      if (Session.get('author') !== "") {
        var author = Session.get('author');
        postsReactiveCount = Posts.find({author: author}, {sort: {submitted: -1}}).fetch().length;  
      }
      else if (Session.get('category') !== "") {
        var category = Session.get('category');
        postsReactiveCount = Posts.find({category: category}, {sort: {submitted: -1}}).fetch().length;
      }
      else if (Session.get('tag') !== "") {
        var tag = Session.get('tag');
        postsReactiveCount = Posts.find({tags: tag}, {sort: {submitted: -1}}).fetch().length; 
      }
      else
        postsReactiveCount = Posts.find().fetch().length;

      if (nbPosts < postsReactiveCount && nbPosts != 0)
        return (postsReactiveCount - nbPosts);
      else
        return false;
    }
  },
  isReactive: function() {
    return Session.get('isReactive');
    },
  updateAlert: function() {
      if (Meteor.user().profile) {
        if (Meteor.user().profile.lastAlert >= 1)
          return false
        else
          return true
    }
      else return true
    }
});


Template.blogPage.events({
  'click .button-ok-update-alert': function() {
    Meteor.users.update(Meteor.user()._id, {$set: {"profile.lastAlert": 1}});
  },
  'click .button-send-to-api': function(e, template) {
      e.preventDefault();

      Meteor.call('sendBlog', {blogId: template.data.blog._id} );
    },
  'click .hideCodePanel': function(e) {
    e.preventDefault();

    $( "#codePanel" ).hide();

    Blogs.update(this.blog._id, {$set : {codePanel : 0}});         
  },
  'click .blog-page--button-reactive': function(e) {
    e.preventDefault();

    Session.set('isReactive', true)        
  },
  'click .blog-page--button-stop-reactive': function(e) {
    e.preventDefault();

    Session.set('isReactive', false)        
  },
  'click .blog-page--refresh': function(e) {
    e.preventDefault();

      if (Session.get('author') !== "") {
        var author = Session.get('author');
        Session.set('nbPosts',Posts.find({author: author}).fetch().length); 
      }
      else if (Session.get('category') !== "") {
        var category = Session.get('category');
        Session.set('nbPosts',Posts.find({category: category}).fetch().length); 
      }
      else if (Session.get('tag') !== "") {
        var tag = Session.get('tag');
        Session.set('nbPosts',Posts.find({tags: tag}).fetch().length); 
      }
      else
        Session.set('nbPosts',Posts.find({}).fetch().length);       
  }  
});