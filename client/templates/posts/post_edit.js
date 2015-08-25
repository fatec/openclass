Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id;
    
    var postProperties = {
      body: $(e.target).find('[name=body]').val()
    }
    //console.log(postProperties.body);

   // var errors = validatePost(postProperties);
   // if (errors.title || errors.url)
   //   return Session.set('postEditErrors', errors);
    var currentPost = Posts.findOne(currentPostId);
    //console.log(currentPost.blogId);


    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        //throwError(error.reason);
        console.log(error.reason);
      } else {
        Router.go('blogPage', {_id: currentPost.blogId});
      }
    });
  },
    'cancel form': function(e) {
    e.preventDefault();
    

  },
});
