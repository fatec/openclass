Template.postEditHeader.events({
    'click .post-edit--button-submit': function(e) {
    e.preventDefault();
    $('#post-edit--form').submit();
  }
});