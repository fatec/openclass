PostSubmitController = RouteController.extend({
  onBeforeAction: function () {

    if (!Session.get(this.params._id))  {
      // if the user is not logged in, render the Login template
      this.render('blogEditHeader', {to: 'layout--header'});
      this.render('blogUsers', {to: 'layout--main'});

          } else {
      // otherwise don't hold up the rest of hooks or our route/action function
      // from running
      this.next();
    }
},
  waitOn: function () {

    return [
      Meteor.subscribe('images2'), // TODO souscrire seulement à l'image temporaire du post entrain d'être créé

      //Meteor.subscribe('images', this.params._id), // TODO souscrire seulement à l'image temporaire du post entrain d'être créé
      Meteor.subscribe('tags', this.params._id),
      Meteor.subscribe('authors', this.params._id),
      Meteor.subscribe('categories', this.params._id),
      Meteor.subscribe('blog', this.params._id),
    ];
  },

  data: function () {    
    return {
      blog: Blogs.findOne(this.params._id)
    }
  },

  action: function () {
    //this.render('postSubmitHeader', {to: 'layout--header'});
    // this.render('postSubmit', {to: 'layout--main'});
    this.render();
  },
  
  onAfterAction: function () {
      // On met dans la session l'image actuelle et on reinitialise la valeur de session imageToDelete
    Session.set('imageId', false);
    Session.set('imagesToDelete', []);
    Session.set('imageToAdd', false);
  },
    fastRender: true
});