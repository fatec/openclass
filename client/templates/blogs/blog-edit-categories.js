Template.blogEditCategories.helpers({
  categories: function(){
    return Categories.find({blogId: this.blog._id});  
  }
});
Template.blogEditCategories.events({
  'click .blog-edit-authors--button-delete-category': function(event, template) {

    var currentBlogId = template.data.blog._id;
    var categoryName = $(event.target).data("name");
    var category = Categories.findOne({name: categoryName, blogId: currentBlogId});
    if(confirm("Supprimer la catégorie "+categoryName+" ?"))
      Categories.remove(category._id);
  }, 
  'submit form.blog-edit--form-add-category': function(e) {
    e.preventDefault();

    var currentBlogId = this.blog._id;
    var categoryName = $('#categoryName').val().trim();

    Meteor.call('categoryInsert', categoryName, this.blog._id );

    $('#categoryName').val('');

  }
});