Template.postSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();
    
    var $body = $(e.target).find('[name=body]');
    var post = {
      body: $body.val(),
      blogId: template.data._id
    };

    var errors = {};
    if (! post.body) {
      errors.body = "Please write some content";
      return Session.set('postSubmitErrors', errors);
    }
    
    Meteor.call('postInsert', post, function(error, postId) {
      if (error){
        throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});
