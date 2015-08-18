Template.blogSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var blog = {
      title: $(e.target).find('[name=title]').val()
    };



    Meteor.call('blogInsert', blog, function(error, result) {
        // affiche l'erreur à l'utilisateur et s'interrompt
        if (error)
            return alert(error.reason);

        Router.go('blogPage', {_id: result._id});
    });
    
  }
});
