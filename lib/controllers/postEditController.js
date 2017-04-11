PostEditController = RouteController.extend({
  waitOn: function () {
    blogId = Posts.findOne(this.params._id).blogId;
    return [
      Meteor.subscribe('postsEdit', this.params._id),
      Meteor.subscribe('postImage', this.params._id),
      Meteor.subscribe('tags', blogId),
      Meteor.subscribe('categories', blogId)  ,
      Meteor.subscribe('blogs', this.params._id),
      Meteor.subscribe('images2', this.params._id)
    ]; 
  },

  data: function () {
    return {
      post: Posts.findOne(this.params._id),
    }
  },

  action: function () {
    //this.render('postEditHeader', {to: 'layout--header'});
    //this.render('postEdit', {to: 'layout--main'});
        this.render();

  },

  onAfterAction: function () {
      // On met dans la session l'image actuelle et on reinitialise la valeur de session imageToDelete
      var editedPost = Posts.findOne(this.params._id);
      Session.set('imageId', editedPost.imageId);
      Session.set('imagesToDelete', []);
      Session.set('imageToAdd', false);
      //delete Session.keys['imageToDelete'];
  },
    fastRender: true
});