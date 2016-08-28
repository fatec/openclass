Template.blogUsers.helpers({

  authors: function(){
    return Authors.find({blogId: this.blog._id},{sort: { name: 1 }});  
  },
  optionIsSelected: function(authorName) {
    //console.log(Session.get("5AutbBDeRpPLWn4tp"));
    //return Session.get("5AutbBDeRpPLWn4tp");
    return authorName === Session.get(Template.parentData().blog._id).author;

  }  
});

  Template.blogUsers.events({
  'click .blog-users--button-select-author': function(event) {
    event.preventDefault();
    // var password = prompt("Entrez le mot de passe pour l'utilisateur "+$(event.target).val());
    // if (password == "admin")
    //console.log(this.blogId);

    //console.log(event.currentTarget.dataset.author);
      Session.set(this.blogId, {author: event.currentTarget.dataset.author});
    // else
    // {
      //Session.set(this.blog._id, {author: "Invité"}); 
      //console.log($('.header--select-author option[value="Invité"]'));
      //$('.header--select-author option[value="Invité"]').prop('selected', true);
    //}
  } 
});