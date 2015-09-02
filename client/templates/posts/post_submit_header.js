Template.postSubmitHeader.events({
    'click .post-submit--button-submit': function(e) {
    e.preventDefault();
    $('#post-submit--form').submit();
  }
});