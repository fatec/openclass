  Template.postsHeader.helpers({
  isAdmin: function() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
        return true;
    }
});