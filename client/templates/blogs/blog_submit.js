Template.blogSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    //var blogTitle = Meteor.user().username + '/' + $(e.target).find('[name=title]').val();

    var blog = {
      title: $(e.target).find('[name=title]').val()
    };
    //blog = 'widmer' + blogTitle;
    
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
  },
    'keyup .blog-submit--input': function () {
        Session.set("blogTitle", $(".blog-submit--input").val());
    }      
});

Template.blogSubmit.helpers({
  errorMessage: function() {
    return Session.get('errorMessage');
  },
  code: function() {
    var blogTitle = Session.get("blogTitle");
    var code = Meteor.user().username + '/' + blogTitle;
    return code;   
  }  
});

Template.blogSubmit.rendered = function(){
  this.$('.blog-submit--input').focus();
  Session.set("blogTitle", '');   
}