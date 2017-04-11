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
  'click .blog-edit--rename-button': function(e) {

    e.preventDefault();

    var currentBlogId = this.blog._id;

    var answer = prompt("Renommer cet espace :", this.blog.title);

    if (answer) {
      var blogProperties = {
        title: answer
      }

      Blogs.update(currentBlogId, {$set: blogProperties}, function(error) {
        if (error)
        {
          console.log("BlogEdit submit-form event "+error.message);
          Session.set('errorMessage', error.message);
        } 
      });
  }
},
  'click .blog-edit--delete-button': function(e) {
    e.preventDefault();

    if (confirm("Effacer cet espace ?")) {
      var currentBlogId = this.blog._id;
      Blogs.remove(currentBlogId);
      // Effacer les posts qui correspondent a ce blogId
      // TODO
      //Posts.remove();
      Router.go('blogsList');
    }
  },
    'click .blog-edit--activate-reactiveness': function(e) {
    e.preventDefault();

    if (Session.get('isReactive'))
          Session.set('isReactive',false);
    else
          Session.set('isReactive',true);
  },
    'click .blog-edit--activate-comments': function(e) {
      e.preventDefault();
    
      if (this.blog.commentsAllowed)
        Blogs.update(this.blog._id, {$set: {commentsAllowed:false}});
      else
        Blogs.update(this.blog._id, {$set: {commentsAllowed:true}});
  },
      'click .blog-edit--activate-create-user': function(e) {
      e.preventDefault();
    
      if (this.blog.createUserAllowed)
        Blogs.update(this.blog._id, {$set: {createUserAllowed:false}});
      else
        Blogs.update(this.blog._id, {$set: {createUserAllowed:true}});
  },
      'click .blog-edit--change-password': function(e) {
    e.preventDefault();

        var oldPassword = prompt("Mot de passe actuel :");
        var newPassword = prompt("Nouveau mot de passe :");
      Accounts.changePassword(oldPassword, newPassword, function(error){if(error){alert("Impossible de changer de mot de passe.")}else{alert("Votre mot de passe a été changé.")}});
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
  'click .blog-edit--sync-button': function(e, template) {
      e.preventDefault();
      console.log("On clique sur le bouton "+this.blog._id)
      Meteor.call('sendBlog', {blogId: this.blog._id} );
    }  
}); 


Template.blogEdit.helpers({
  serverIP: function() {
    Meteor.call('hup', function(error, result){
      if(error){
        Session.set('serverIP',"Pas d'adresse IP");
      }else{
        Session.set('serverIP',result);
      }
    });
    return Session.get('serverIP');
    //return Meteor.call('hup');
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
  },
  isBox: function() {
    // console.log(Meteor.settings.public.isBox);
    return (Meteor.settings.public.isBox === "true")
  },
  isReactive: function() {
    return Session.get('isReactive')
  },
  commentsAreAllowed: function() {
    return this.blog.commentsAllowed
  },
    createUserIsAllowed: function() {
      return this.blog.createUserAllowed
    }

});
