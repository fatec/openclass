Template.blogEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentBlogId = this._id;

    var blogProperties = {
      title: $(e.target).find('[name=title]').val()
    }

    Blogs.update(currentBlogId, {$set: blogProperties}, function(error) {
      if (error) {
        // affiche l'erreur à l'utilisateur
        alert(error.reason);
      } else {
        Router.go('blogPage', {_id: currentBlogId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Effacer ce journal?")) {
      var currentBlogId = this._id;
      Blogs.remove(currentBlogId);
      Router.go('blogsList');
    }
  }
});
