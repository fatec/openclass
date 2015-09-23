Template.blogEdit.events({
  'submit form.blog-edit--form': function(e) {
    e.preventDefault();

    var currentBlogId = this._id;

    var blogProperties = {
      title: $(e.target).find('[name=title]').val()
    }

    Blogs.update(currentBlogId, {$set: blogProperties}, function(error) {
      if(!error) {
        alert("Le nom du journal a été changé.")
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

    var currentBlogId = this._id;
    var authorName = $('#authorName').val();

    Meteor.call('authorInsert', authorName, this._id );

    $('#authorName').val('');

  }, 
  'click .blog-edit--delete-author': function(event, template) {

    var currentBlogId = template.data._id;
    var authorName = $(event.target).data("name");
    var author = Authors.findOne({name: authorName, blogId: currentBlogId});
    if(confirm("Supprimer l'auteur "+authorName+" ?"))
      Authors.remove(author._id);

  }, 
  'click .blog-edit--button-submit': function(e) {
    e.preventDefault();
    $('#blog-edit--form').submit();
  },
   'click .blog-edit--button-submit-add-author': function(e) {
    e.preventDefault();
    $('#blog-edit--form-add-author').submit();
  }, 
  'click .blog-edit--button-cancel': function(e) {
    e.preventDefault();
    history.back();  
  },   
  'click .blog-edit--button-delete': function(e) {
    e.preventDefault();

    if (confirm("Effacer ce journal?")) {
      var currentBlogId = this._id;
      Blogs.remove(currentBlogId);
      // Effacer les posts qui correspondent a ce blogId
      // TODO
      //Posts.remove();
      Router.go('blogsList');
    }
  },
  'click .button-send-to-api': function(e, template) {
      e.preventDefault();
      //console.log("On clique sur le bouton "+template.data._id)
      Meteor.call('sendBlog', {blogId: template.data._id} );
    }  
}); 


Template.blogEdit.helpers({
  authors: function(){
    return Authors.find({blogId: this._id});  
  },
  authorsCount: function() {
    return Authors.find({blogId: this._id}).count();  
  }
});
