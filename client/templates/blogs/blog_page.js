var posts;


    //var authorName = Session.get(template.data.blog._id).author; 

  //var testId = Authors.findOne({blogId: template.data.blog._id, name: authorName});

    //Authors.update(testId._id, {$set : {scroll : 50}})


Template.blogPage.onCreated(function() {



  viewport = document.querySelector("meta[name=viewport]");
viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=4');


  var blogId = this.data.blog._id;
  Session.set("scroll", 0);
  Session.set("click", 0);


  function updateScroll(Template) {
    var scroll = Session.get("scroll");
      var authorName = Session.get(blogId).author; 
      var testId = Authors.findOne({blogId: blogId, name: authorName});
      Authors.update(testId._id, {$inc : {scroll : scroll}})
      Session.set("scroll", 0);
  };

    function updateClick(Template) {
    var click = Session.get("click");
      var authorName = Session.get(blogId).author; 
      var testId = Authors.findOne({blogId: blogId, name: authorName});
      Authors.update(testId._id, {$inc : {click : click}})
      Session.set("click", 0);
  };

      scrollUpdate = Meteor.setInterval(updateScroll, 1000);
      clickUpdate = Meteor.setInterval(updateClick, 1000);



    $(window).scroll(function() {

      Session.set("scroll", Session.get("scroll")+1);

      // var scroll = Session.get("scroll");
      // scroll++;

      // Session.set("scroll", scroll);


    });


});


Template.blogPage.helpers({
  posts_old: function() {
    var sortPosts = Session.get('sortPosts');
    var sort;
    if(sortPosts == "last")
      sort = -1;
    else
      sort = 1;
    if (Router.current().params.query.tags)
      return Posts.find({tags: {$in: [Router.current().params.query.tags]}}, {sort: {submitted: -1}});
    else if (Router.current().params.query.author)
      return Posts.find({author: {$in: [Router.current().params.query.author]}}, {sort: {submitted: -1}});
    else if (Router.current().params.query.category)
      return Posts.find({category: {$in: [Router.current().params.query.category]}}, {sort: {submitted: -1}});    
    else {
      // check to avoid an exception on changing template
      if (this.blog !== undefined) {
          return Posts.find({},{sort: {submitted: -1}});
//return Posts.find({}, {  reactive: false} ).fetch();
        //return Posts.find({},{sort: {nb: -1},reactive:false}).fetch();
      } else {
        return null;
      }
    }
  },
  posts: function() {


      if (this.blog !== undefined) {

    if (Session.get('isReactive'))
    {

      switch (Session.get('filter'))
      {
        case '':
          Session.set('posts',Posts.find({},{sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;
        case 'favorites':
          Session.set('posts',Posts.find({favorites:true},{sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;
        case 'tag':
          var tag = Session.get('tag');
          Session.set('posts',Posts.find({tags: tag}, {sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;
        case 'category':
          var category = Session.get('category');
          Session.set('posts',Posts.find({category: category}, {sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;
        case 'author':
          var author = Session.get('author');
          Session.set('posts',Posts.find({author: author}, {sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;          
      }
    }
    return Session.get('posts');

      } else {
        return null;
      }



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
        newMessages2: function() {
    if (Session.get('isReactive'))
    {
      var nbPosts = Session.get('nbPosts');
      var postsReactiveCount;

      switch (Session.get('filter'))
      {
        case '':
          postsReactiveCount = Posts.find().fetch().length;
          break;
        case 'favorites':
          postsReactiveCount = Posts.find({favorites:true}).fetch().length;
          break;
        case 'tag':
          var tag = Session.get('tag');
          postsReactiveCount = Posts.find({tags: tag}, {sort: {submitted: -1}}).fetch().length;
          break;
        case 'category':
          var category = Session.get('category');
          postsReactiveCount = Posts.find({category: category}, {sort: {submitted: -1}}).fetch().length;
          break;
        case 'author':
          var author = Session.get('author');
          postsReactiveCount = Posts.find({author: author}, {sort: {submitted: -1}}).fetch().length;
          break;          
      }
      if (nbPosts < postsReactiveCount)
        return (postsReactiveCount - nbPosts);
      else
        return false;
    }
  },
    newMessages: function() {
    if (!Session.get('isReactive'))
    {
      var postsCount = Session.get('posts').length;
      var postsReactiveCount;

      switch (Session.get('filter'))
      {
        case '':
          postsReactiveCount = Posts.find().fetch().length;
          break;
        case 'tag':
          var tag = Session.get('tag');
          postsReactiveCount = Posts.find({tags: tag}, {sort: {submitted: -1}}).fetch().length;
          break;
        case 'category':
          var category = Session.get('category');
          postsReactiveCount = Posts.find({category: category}, {sort: {submitted: -1}}).fetch().length;
          break;
        case 'author':
          var author = Session.get('author');
          postsReactiveCount = Posts.find({author: author}, {sort: {submitted: -1}}).fetch().length;
          break;          
      }
      if (postsCount < postsReactiveCount)
        return (postsReactiveCount - postsCount);
      else
        return false;
    }
  },
    selectedTagClass: function(){
      console.log("j'ysui");

    var tagId = this.toString();
    if (Session.get('filter') === 'tag')
    {
      var selectedTag = Session.get('tag');
      if(tagId == selectedTag){
        return "post-item--tag-selected"
      }
    }
  },
    isReactive: function() {
    return Session.get('isReactive');
    }
});


Template.blogPage.events({
	'click .button-send-to-api': function(e, template) {
      e.preventDefault();
      //console.log("On clique sur le bouton "+template.data._id)
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

      switch (Session.get('filter'))
      {
        case '':
          Session.set('nbPosts',Posts.find({}).fetch().length); 
          Session.set('posts',Posts.find({},{sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;
        case 'favorites':
          Session.set('nbPosts',Posts.find({favorites: true}).fetch().length); 
          Session.set('posts',Posts.find({favorites:true},{sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;
        case 'tag':
          var tag = Session.get('tag');
          Session.set('nbPosts',Posts.find({tags: tag}).fetch().length); 
          Session.set('posts',Posts.find({tags: tag}, {sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;
        case 'category':
          var category = Session.get('category');
          Session.set('nbPosts',Posts.find({category: category}).fetch().length); 
          Session.set('posts',Posts.find({category: category}, {sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;
        case 'author':
          var author = Session.get('author');
          Session.set('nbPosts',Posts.find({author: author}).fetch().length); 
          Session.set('posts',Posts.find({author: author}, {sort: {submitted: 1},limit:Session.get("nbPosts")}).fetch().reverse());
          break;          
      }       
  }  


  
});

Template.blogPage.created = function(){

    Session.set('filter','');
    Session.set('isReactive',true);
    Session.set('nbPosts', Posts.find({}).fetch().length);
    console.log(Session.get('nbPosts'));

  //test = new Meteor.Collection('testCollect');
  Session.set('posts',Posts.find({},{sort: {submitted: -1}}).fetch());


  //posts2 = Posts.find({},{sort: {nb: -1}}).fetch();
  //posts = posts2;
  // Set default author
}