  Template.layout.onRendered(function () {
    var template = this;
    slideout = new Slideout({
      'panel': template.$('#content').get(0),
      'menu': template.$('#slideout-menu').get(0),
      'padding': 256,
      'tolerance': 70,
      'touch': false
    });
        T9n.setLanguage("fr");




  function close(event) {
  event.preventDefault();
  slideout.close();
  event.stopPropagation(); // Prevent click propagation to menu wrapper button
}

slideout
  .on('beforeopen', function() {
    this.panel.classList.add('panel-open');
  })
  .on('open', function() {
    this.panel.addEventListener('click', close);
  })
  .on('beforeclose', function() {
    this.panel.classList.remove('panel-open');
    this.panel.removeEventListener('click', close);
  });

  

  });

  Template.layout.events({
  // Speedup focus on input for mobile devices
  'touchend input': function(e) {
    $(e.target).focus();
  },
  'touchend textarea': function(e) {
    $(e.target).focus();
  },  
    'click .header--button-menu-wrapper': function(e) {
        e.preventDefault();
        slideout.toggle();
    }
});

  Template.layout.helpers({
  isAdmin: function() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
        return true;
    }
});