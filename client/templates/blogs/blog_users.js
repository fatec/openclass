Template.blogUsers.helpers({

  authors: function(){
    return Authors.find({blogId: this.blog._id},{sort: { name: 1 }});  
  },
  createUserAllowed: function() {
      return this.blog.createUserAllowed;
  },
  optionIsSelected: function(authorName) {
    if (Session.get(Template.parentData().blog._id))
    {
    //console.log(Session.get("5AutbBDeRpPLWn4tp"));
    //return Session.get("5AutbBDeRpPLWn4tp");
    return authorName === Session.get(Template.parentData().blog._id).author;
}
else
return null;
  }  
});

  Template.blogUsers.events({
  'click .blog-users--button-submit-author': function(event, template) {
    event.preventDefault();
    var authorName = $('#authorName').val().trim();
    //console.log(template.data.blog._id);

    //Session.set(template.data.blog._id, {author: authorName});

    if (authorName != "")
    {
      
      if (Authors.findOne({blogId: template.data.blog._id, name:authorName}))
      {
        if(confirm("L'utilisateur "+authorName+" existe déjà. Se connecter avec ce nom ?")){
          Session.setPersistent(template.data.blog._id, {author: authorName});
                    Router.go('blogPage', {_id: template.data.blog._id});

  }
        else
          return;
      }
      else {
      Meteor.call('authorInsert', authorName, template.data.blog._id );
    Session.setPersistent(template.data.blog._id, {author: authorName});
          Router.go('blogPage', {_id: template.data.blog._id});

      }


      //var authors = Authors.find({blogId: this.blog._id});
      //console.log(authors);


  }


    },
  'click .blog-users--button-select-author': function(event, template) {
    event.preventDefault();
    // var password = prompt("Entrez le mot de passe pour l'utilisateur "+$(event.target).val());
    // if (password == "admin")
    //console.log(this.blogId);

    //console.log(event.currentTarget.dataset.author);
      Session.setPersistent(this.blogId, {author: event.currentTarget.dataset.author});
                Router.go('blogPage', {_id: template.data.blog._id});

    // else
    // {
      //Session.set(this.blog._id, {author: "Invité"}); 
      //console.log($('.header--select-author option[value="Invité"]'));
      //$('.header--select-author option[value="Invité"]').prop('selected', true);
    //}
  },
      'keypress .blog-users--input-choose-author': function (e, template) {

    if (e.which === 13) {
      e.preventDefault();
    var authorName = $('#authorName').val().trim();
    //console.log(template.data.blog._id);

    //Session.set(template.data.blog._id, {author: authorName});

    if (authorName != "")
    {
      
      if (Authors.findOne({blogId: template.data.blog._id, name:authorName}))
      {
        if(confirm("L'utilisateur "+authorName+" existe déjà. Se connecter avec ce nom ?")){
          Session.setPersistent(template.data.blog._id, {author: authorName});
          Router.go('blogPage', {_id: template.data.blog._id});

  }
        else
          return;
      }
      else {
      Meteor.call('authorInsert', authorName, template.data.blog._id );
    Session.setPersistent(template.data.blog._id, {author: authorName});
          Router.go('blogPage', {_id: template.data.blog._id});

      }


      //var authors = Authors.find({blogId: this.blog._id});
      //console.log(authors);


  }


    }
  }   
});