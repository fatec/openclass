PostSubmitController = RouteController.extend({

  waitOn: function () {
    if (!Session.get(this.params._id)) Session.set(this.params._id, {author: 'Invité'});
      Session.set('imageId', false);
    return [
          Meteor.subscribe('images2'), // TODO souscrire seulement à l'image temporaire du post entrain d'être créé

      //Meteor.subscribe('images', this.params._id), // TODO souscrire seulement à l'image temporaire du post entrain d'être créé
      Meteor.subscribe('tags', this.params._id),
      Meteor.subscribe('authors', this.params._id),
      Meteor.subscribe('categories', this.params._id),
      Meteor.subscribe('blogs', this.params._id),
    ];
  },

  data: function () {    
    return {
      blog:Blogs.findOne(this.params._id),
    }
  },

  action: function () {
    this.render('postSubmitHeader', {to: 'layout--header'});
    this.render('postSubmit', {to: 'layout--main'});
  },
  
  onAfterAction: function () {
      // On met dans la session l'image actuelle et on reinitialise la valeur de session imageToDelete
    Session.set('imageId', false);
    Session.set('imagesToDelete', []);
    Session.set('imageToAdd', false);
  }
});