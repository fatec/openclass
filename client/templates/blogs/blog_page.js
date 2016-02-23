var posts;

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
          Session.set('posts',Posts.find({},{sort: {submitted: -1}}).fetch());
          break;
        case 'tag':
          var tag = Session.get('tag');
          Session.set('posts',Posts.find({tags: tag}, {sort: {submitted: -1}}).fetch());
          break;
        case 'category':
          var category = Session.get('category');
          Session.set('posts',Posts.find({category: category}, {sort: {submitted: -1}}).fetch());
          break;
        case 'author':
          var author = Session.get('author');
          Session.set('posts',Posts.find({author: author}, {sort: {submitted: -1}}).fetch());
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
        Session.set('posts',Posts.find({},{sort: {submitted: -1}}).fetch());
        break;
      case 'tag':
        var tag = Session.get('tag');
        Session.set('posts',Posts.find({tags: tag}, {sort: {submitted: -1}}).fetch());
        break;    
      case 'category':
        var category = Session.get('category');
        Session.set('posts',Posts.find({category: category}, {sort: {submitted: -1}}).fetch());
        break; 
      case 'author':
        var author = Session.get('author');
        Session.set('posts',Posts.find({author: author}, {sort: {submitted: -1}}).fetch());
        break;   
    }        
  }  


  
});

Template.blogPage.created = function(){

    Session.set('filter','');

  //test = new Meteor.Collection('testCollect');
  Session.set('posts',Posts.find({},{sort: {submitted: -1}}).fetch());
  //posts2 = Posts.find({},{sort: {nb: -1}}).fetch();
  //posts = posts2;
  // Set default author
}