Template.blogEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentBlogId = this._id;

    var blogProperties = {
      title: $(e.target).find('[name=title]').val()
    }

    Blogs.update(currentBlogId, {$set: blogProperties}, function(error) {
      if(!error) {
        Router.go('blogsList');
      }
      else
      {
        console.log("BlogEdit submit-form event "+error.message);
        Session.set('errorMessage', error.message);
      } 
    });
  },
  'click .blog-edit--button-submit': function(e) {
    e.preventDefault();
    $('#blog-edit--form').submit();
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
