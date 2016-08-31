Template.postItem.helpers({
    image: function() {
      return Images.findOne(this.imageId);
  },
  tags: function(){
    if (this.tags.length > 1 || this.tags[0] != "")
    return this.tags;
  else
    return 0;
  }, 
  favorites: function(){
    console.log(this.favorites);
    return Session.get("favorites");
    //return this.favorites;
  },    
  ownPost: function() {
    //console.log((this.blog._id).author);
        //console.log(Session.get(Template.parentData(1).blog._id).author);


    //if (this.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
    if (Session.get(Template.parentData().blog._id).author === this.author || Template.parentData().blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
      return true;
    },
  tagQuery: function() {
    return "tags="+this.toString();
  },   
  authorQuery: function() {
    return "author="+this.author.toString();
  },   
  categoryQuery: function() {
    return "category="+this.category.toString();
  },     
  selectedTagClass: function(){

    var tagId = this.toString();
    if (Session.get('filter') === 'tag')
    {
      var selectedTag = Session.get('tag');
      if(tagId == selectedTag){
        return "post-item--tag-selected"
      }
    }
  },
  ownBlog: function() {
    if (Template.parentData().blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)        
      return true;
    },
  selectedCategoryClass: function(){
    var categoryId = this.category.toString();
    var selectedCategory = Session.get('selectedCategory');
    if(categoryId == selectedCategory){
      return "post-item--category-selected"
    }
  }
});

Template.postItem.events({
  'click .post-item--button-delete': function(e) {
    e.preventDefault();

    if (confirm("Effacer la publication de "+this.author+"?")) {
      var currentPostId = this._id;
      var currentPost = Posts.findOne(currentPostId);


      // TODO : faire le nettoyage de l'image et des tags dans un hook before remove...

     //  Meteor.call('tagsEdit', {blogId: this.blogId, newTags: [], oldTags: currentPost.tags}, function(error) {
     //    if (error) {
     //      console.log("#### Zut une erreur dans le delete post button ####");
     //      throwError(error.reason);
     //    }
     // });


      Posts.remove(currentPostId);
      // TODO : remove in one call :D
      image = Images.findOne({'metadata.postId': currentPostId});
      if (image){
        Images.remove(image._id);
      }

      author = Authors.findOne({blogId: this.blogId, name: currentPost.author});
      Authors.update(author._id, {$inc: {nRefs: -1}});
      
      // Images.remove({'metadata.postId': "Mik2bg7nvT7yHEpR2"});
      //Router.go('blogPage', {_id: currentPost.blogId});
      if (Session.get('isReactive') != true)
{
          switch (Session.get('filter'))
    {
      case '':
        Session.set('posts',Posts.find({},{sort: {nb: -1}}).fetch());
        break;
      case 'tag':
        var tag = Session.get('tag');
        Session.set('posts',Posts.find({tags: tag}, {sort: {nb: -1}}).fetch());
        break;    
      case 'category':
        var category = Session.get('category');
        Session.set('posts',Posts.find({category: category}, {sort: {nb: -1}}).fetch());
        break; 
      case 'author':
        var author = Session.get('author');
        Session.set('posts',Posts.find({author: author}, {sort: {nb: -1}}).fetch());
        break;   
    }
    }
  }
  },
        'click .filter-tag': function(e) {
    e.preventDefault();
    Session.set('filter','tag');
    var tag = $(e.target).data('tag');
    Session.set('tag',tag);
    Session.set('posts',Posts.find({tags: tag}, {sort: {nb: -1}}).fetch()); 
  },
  'click .filter-author': function(e) {
    e.preventDefault();
    Session.set('filter','author');
    var author = $(e.target).data('author');
    Session.set('author',author);
    Session.set('posts',Posts.find({author: author}, {sort: {nb: -1}}).fetch()); 
  },
  'click .filter-category': function(e) {
    e.preventDefault();
    Session.set('filter','category');
    var category = $(e.target).data('category');
    Session.set('category',category);
    Session.set('posts',Posts.find({category: category}, {sort: {nb: -1}}).fetch()); 
  },
    'click .post-item--button-add-favorite': function(e) {
      e.preventDefault();
      var currentPostId = this._id;
      //Session.set("favorites",true);
      //Meteor.call('add',{postId:currentPostId});
      Posts.update(currentPostId, {$set: {favorites: true}});
  },
      'click .post-item--button-remove-favorite': function(e) {
      e.preventDefault();
      var currentPostId = this._id;

      Posts.update(currentPostId, {$set: {favorites: false}});
  },     
});

// Show image in a lightbox with magnificPopup plugin
Template.postItem.rendered = function(){


    // Set default author
  if (!Session.get(Template.parentData(1).blog._id))
  {
    Session.set(Template.parentData(1).blog._id, {author: 'Invité'});    
  }

  $('.post-item--image-wrapper').imagesLoaded(function(){
    $('.post-item--image-link').magnificPopup({
      type:'image',
      closeOnContentClick:'true',
    });
  });


}


