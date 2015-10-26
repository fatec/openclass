Template.blogEdit.events({
  'submit form.blog-edit--form': function(e) {
    e.preventDefault();

    var currentBlogId = this.blog._id;

    var blogProperties = {
      title: $(e.target).find('[name=title]').val()
    }

    Blogs.update(currentBlogId, {$set: blogProperties}, function(error) {
      if(!error) {
        alert("Le journal s'appelle désormais : "+blogProperties.title)
      }
      else
      {
        console.log("BlogEdit submit-form event "+error.message);
        Session.set('errorMessage', error.message);
      } 
    });
  },
  'submit form.blog-edit--form-add-author': function(e) {
    e.preventDefault();

    var currentBlogId = this.blog._id;
    var authorName = $('#authorName').val().trim();

    Meteor.call('authorInsert', authorName, this.blog._id );

    $('#authorName').val('');

  }, 
  'submit form.blog-edit--form-add-category': function(e) {
    e.preventDefault();

    var currentBlogId = this.blog._id;
    var categoryName = $('#categoryName').val().trim();

    Meteor.call('categoryInsert', categoryName, this.blog._id );

    $('#categoryName').val('');

  },  
  'click .blog-edit--delete-author': function(event, template) {

    var currentBlogId = template.data.blog._id;
    var authorName = $(event.target).data("name");
    var author = Authors.findOne({name: authorName, blogId: currentBlogId});
    if(confirm("Supprimer l'auteur "+authorName+" ?"))
      Authors.remove(author._id);
  },
  'click .blog-edit--delete-category': function(event, template) {

    var currentBlogId = template.data.blog._id;
    var categoryName = $(event.target).data("name");
    var category = Categories.findOne({name: categoryName, blogId: currentBlogId});
    if(confirm("Supprimer la catégorie "+categoryName+" ?"))
      Categories.remove(category._id);
  },   
  'click .blog-edit--button-submit': function(e) {
    e.preventDefault();
    $('#blog-edit--form').submit();
  },
   'click .blog-edit--button-submit-add-author': function(e) {
    e.preventDefault();
    $('#blog-edit--form-add-author').submit();
  }, 
   'click .blog-edit--button-submit-add-category': function(e) {
    e.preventDefault();
    $('#blog-edit--form-add-category').submit();
  },   
  'click .blog-edit--button-cancel': function(e) {
    e.preventDefault();
    history.back();  
  },   
  'click .blog-edit--button-delete': function(e) {
    e.preventDefault();

    if (confirm("Effacer ce journal?")) {
      var currentBlogId = this.blog._id;
      Blogs.remove(currentBlogId);
      // Effacer les posts qui correspondent a ce blogId
      // TODO
      //Posts.remove();
      Router.go('blogsList');
    }
  },
  'click .button-send-to-api': function(e, template) {
      e.preventDefault();
      console.log("On clique sur le bouton "+this.blog._id)
      Meteor.call('sendBlog', {blogId: this.blog._id} );
    }  
}); 


Template.blogEdit.helpers({
  authors: function(){
    return Authors.find({blogId: this.blog._id});  
  },
  guest: function(){
    return this.name === 'Invité';
  },
  authorsCount: function() {
    return Authors.find({blogId: this.blog._id}).count();  
  },
  categories: function(){
    return Categories.find({blogId: this.blog._id});  
  },  
  categoriesCount: function() {
    return Categories.find({blogId: this.blog._id}).count();  
  }  
});
