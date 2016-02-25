Template.blogEditCategories.helpers({
  categories: function(){
    return Categories.find({blogId: this.blog._id},{sort: { name: 1 }});  
  }
});
Template.blogEditCategories.events({
  'click .blog-edit-authors--button-delete-category': function(event, template) {

    var currentBlogId = template.data.blog._id;
    var categoryName = $(event.target).data("delete-name");
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

    // Effect when add a category
  $('*[data-category="'+categoryName+'"]').css("background-color", "#77b3d4");
 setTimeout(function(){  $('*[data-category="'+categoryName+'"]').css("background-color", "");}, 1000);

  }
});