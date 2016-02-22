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
        Meteor.call('sendEmail',
          Meteor.user().emails[0].address,
          'vincent.widmer@beekee.ch',
          'Votre inscription sur beekee.ch',
          'Bonjour, \n\n Bienvenue sur beekee.ch ! \n\n Cette plateforme est en développement, n\'hésitez pas à nous contacter pour nous faire part de vos questions ou remarques. \n\n L\'équipe beekee.ch');
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