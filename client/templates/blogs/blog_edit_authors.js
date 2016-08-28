Template.blogEditAuthors.helpers({
	authors: function(){
		return Authors.find({blogId: this.blog._id},{sort: { name: 1 }});  
  },
	guest: function(){
		return this.name === 'Invité';
  }
});
Template.blogEditAuthors.events({
  'click .blog-edit-authors--button-delete-author': function(event, template) {
    var currentBlogId = template.data.blog._id;
    var authorName = $(event.target).data("delete-author");
    var author = Authors.findOne({name: authorName, blogId: currentBlogId});
    if(confirm("Supprimer l'auteur "+authorName+" ?"))
      Authors.remove(author._id);
  },
    'submit form.blog-edit--form-add-author': function(e) {
    e.preventDefault();

    var currentBlogId = this.blog._id;

    var authorName = $('#authorName').val().trim();

    if (authorName != "")
    {
      
      if (Authors.findOne({blogId: this.blog._id, name:authorName}))
      {
        alert("Cet auteur existe déjà.");
        return;
      }


      //var authors = Authors.find({blogId: this.blog._id});
      //console.log(authors);

      Meteor.call('authorInsert', authorName, this.blog._id );

      $('#authorName').val('');

  //$('*[data-author="'+authorName+'"]').css("background-color","black");

//$('*[data-author="'+authorName+'"]').animate({backgroundColor: '#FF0000'}, 'slow')

// Effect when add an author
  $('*[data-author="'+authorName+'"]').css("background-color", "#77b3d4");
 setTimeout(function(){  $('*[data-author="'+authorName+'"]').css("background-color", "");}, 1000);
  }

  }
});