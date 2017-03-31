  function addClick(blogId,content) {

   var authorId = Authors.findOne({name: Session.get(blogId).author});
   //console.log(authorId);
    Authors.update({ _id: authorId._id },{ $push: { clicks: content }})
  }

Template.postItem.helpers({
  commentsAllowed: function() {
    if (Template.parentData().blog.commentsAllowed)
      return true;
  },
    image: function() {
      return Images.findOne(this.imageId);
  },
  tags: function(){
    if (this.tags.length > 1 || this.tags[0] != "")
    return this.tags;
  else
    return 0;
  },
  likes: function() {
        if (this.likes) {
    return this.likes.length;
  }
  },
  likesWithoutMe: function() {
    if (this.likes) {
    return this.likes.length-1;
  }
  },
  likeAlready: function() {
    var author = Session.get(Template.parentData(1).blog._id).author; 
    if ($.inArray(author,this.likes) != -1)
      return true
  },

  othersLikes: function() {
        if (this.likes) {
    if (this.likes.length > 1)
      return true;
  }
  },
    likesComment: function() {
          if (this.likes) {

    return this.likes.length;
  }
  },
    likeAlreadyComment: function() {

    var author = Session.get(Template.parentData(2).blog._id).author; 
    if ($.inArray(author,this.likes) != -1)
      return true;
  },
  favorites: function(){
    //console.log(this.favorites);
    return Session.get("favorites");
    //return this.favorites;
  },    
  ownPost: function() {
    //console.log((this.blog._id).author);
        //console.log(Session.get(Template.parentData(1).blog._id).author);


    //if (this.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
    //if (Session.get(Template.parentData().blog._id).author === this.author || Template.parentData().blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
      if (Session.get(Template.parentData().blog._id).author === this.author && Session.get(Template.parentData().blog._id).author != "Invité")
        return true;
      if (Template.parentData().blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
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

          // Decrement category list
      category = Categories.findOne({blogId: this.blogId, name: currentPost.category});
      Categories.update(category._id, {$inc: {nRefs: -1}});
      
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
    addClick(Template.parentData().blog._id,"tag: "+tag);

  },
  'click .filter-author': function(e) {
    e.preventDefault();
    Session.set('filter','author');
    var author = $(e.target).data('author');
    Session.set('author',author);
    Session.set('posts',Posts.find({author: author}, {sort: {nb: -1}}).fetch()); 
      addClick(Template.parentData().blog._id,"author: "+author);

  },
  'click .filter-category': function(e) {
    e.preventDefault();
    Session.set('filter','category');
    var category = $(e.target).data('category');
    Session.set('category',category);
    Session.set('posts',Posts.find({category: category}, {sort: {nb: -1}}).fetch()); 
        addClick(Template.parentData().blog._id,"category: "+category);

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
  //     'click .post-item--add-comment-button': function(e) {
  //     e.preventDefault();

  //     var currentPostId = this._id;
  //     //var comment = $(e.target).data('category');

  //     var comment = $('#comment').val();
  //     var author = Session.get(Template.parentData(1).blog._id).author; 

  //     if (comment != "") {
  //     Posts.update(currentPostId, {$push: {comments: {id:Random.id(),author: author, submitted:Date.now(),text:comment}}});
  //     $('#comment').val('');
  //   }
  // }, 
      'click .post-item--add-like': function(e) {
      e.preventDefault();

      var currentPostId = this._id;
      var author = Session.get(Template.parentData(1).blog._id).author; 
     
      Posts.update(currentPostId, {$push: {likes: author}});
  }, 
  'click .post-item--show-comment-input': function(e) {
      e.preventDefault();

      $(e.target).parent().find('textarea').show();
      $(e.target).hide();
// $(event.target).closest('element-row').find('.title')
//       data('postid');

  },
    'click .post-item--comment-add-like': function(e) {
      e.preventDefault();



      var currentPostId = $(e.target).data('postid');

      var currentCommentId = $(e.target).data('id');
      var author = Session.get(Template.parentData(1).blog._id).author; 
      //console.log(currentCommentId);
            //console.log(author);

      Meteor.call('addLikeComment',{currentPostId:currentPostId,currentCommentId:currentCommentId,author,author});
      //       console.log(currentPostId);


      Posts.update({_id:currentPostId,"comments.id":currentCommentId}, {$push: {"comments.likes": author}});
  }, 
      'click .post-item--comment-delete': function(e) {
      e.preventDefault();

      //var currentPostId = $(e.target).data('postId');

      //var currentPostId = $(e.currentTarget).parent()._id;

      var currentPostId = $(e.target).data('postid');


      var currentCommentId = $(e.target).data('id');

    if (confirm("Effacer le commentaire ?")) {

      Posts.update(currentPostId, {$pull: {comments: {id:currentCommentId}}}, {multi:true});

}
  },
    'keypress .post-item--add-comment-textarea': function (e, template) {

    if (e.which === 13) {
      e.preventDefault();
      var currentPostId = this._id;


      //var currentPostId = this._id;
      //var comment = $(e.target).data('category');

      var comment = $(e.target).val();
      var author = Session.get(Template.parentData(1).blog._id).author; 

      if (comment != "") {
      Posts.update(currentPostId, {$push: {comments: {id:Random.id(),author: author, submitted:Date.now(),text:comment}}});
      $(e.target).val('');
    }


    }
  }   
});

// Show image in a lightbox with magnificPopup plugin
Template.postItem.rendered = function(){

  // Textarea autosize
  $('.post-item--add-comment-textarea').autosize();

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

    $('.post-item--text').linkify();



}


