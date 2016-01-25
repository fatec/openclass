Template.blogEditAuthors.helpers({
  authors: function(){
    return Authors.find({blogId: this.blog._id});  
  },
});
Template.blogEditAuthors.events({
  'click .blog-edit-authors--button-delete-author': function(event, template) {
    var currentBlogId = template.data.blog._id;
    var authorName = $(event.target).data("name");
    var author = Authors.findOne({name: authorName, blogId: currentBlogId});
    if(confirm("Supprimer l'auteur "+authorName+" ?"))
      Authors.remove(author._id);
  },
    'submit form.blog-edit--form-add-author': function(e) {
    e.preventDefault();

    var currentBlogId = this.blog._id;
    var authorName = $('#authorName').val().trim();

    Meteor.call('authorInsert', authorName, this.blog._id );

    $('#authorName').val('');
  }
});