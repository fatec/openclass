Template.postSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();


    var $body = $(e.target).find('[name=body]');
    var post = {
      body: $body.val(),
      blogId: template.data.blog._id
    };

    //console.log("On va trouver ce pb! :D body:"+post.body+ " blogId: "+post.blogId);

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


Template.postSubmit.helpers({
  myFormData: function() {
    //console.log("MyFormData "+ this.blog._id);
    return {
      blogId: this.blog._id
    }
  }
});