Template.blogSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var blog = {
      title: $(e.target).find('[name=title]').val()
    };
    
    Meteor.call('blogInsert', blog, function(error, result) {
      if(!error) {
        Router.go('blogPage', {_id: result._id});
      }
      else
      {      
        Session.set('errorMessage', err.message);
      }     
    });
    
  },
  'click .blog-submit--button-submit': function(e) {
    e.preventDefault();
    $('#blog-submit--form').submit();
  },
  'click .blog-submit--button-cancel': function(e) {
    e.preventDefault();
    history.back();  
  }     
});

Template.blogSubmit.helpers({
  errorMessage: function() {
    return Session.get('errorMessage');
  }
});