Template.postItem.helpers({
  image: function() {
    //return Images.findOne({'metadata.blogId': this.blogId, 'metadata.postId': this._id});
    return Images.findOne(this.imageId);
  },
  tags: function(){
    if (this.tags.length > 1 || this.tags[0] != "")
    return this.tags;
  else
    return 0;
  },  
  ownPost: function() {
    //console.log((this.blog._id).author);
        //console.log(Session.get(Template.parentData(1).blog._id).author);


    //if (this.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
    if (Session.get(Template.parentData().blog._id).author === this.author || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)
          //if (Session.get(Template.parentData(1).blog._id).author === this.author)

        return true;
    },
  tagQuery: function() {
    return "tags="+this.toString();
  },   
  authorQuery: function() {
    return "author="+this.author.toString();
  },     
  'selectedTagClass': function(){
    var tagId = this.toString();
    var selectedTag = Session.get('selectedTag');
    if(tagId == selectedTag){
      return "post-item--tag-selected"
    }
  }
});

Template.postItem.events({
  'click .post-item--button-delete': function(e) {
    e.preventDefault();

    if (confirm("Effacer la publication de "+this.author+"?")) {
      var currentPostId = this._id;
      var currentPost = Posts.findOne(currentPostId);


      // TODO : faire le nettoyage de l'image et des tags dans un hook before remove...

      Meteor.call('tagsEdit', {blogId: this.blogId, newTags: [], oldTags: currentPost.tags}, function(error) {
        if (error) {
          console.log("#### Zut une erreur dans le delete post button ####");
          throwError(error.reason);
        }
     });


      Posts.remove(currentPostId);
      // TODO : remove in one call :D
      image = Images.findOne({'metadata.postId': currentPostId});
      if (image){
        Images.remove(image._id);
      }

      author = Authors.findOne({blogId: this.blogId, name: currentPost.author});
      Authors.update(author._id, {$inc: {nRefs: -1}});
      
      // Images.remove({'metadata.postId': "Mik2bg7nvT7yHEpR2"});
      Router.go('blogPage', {_id: currentPost.blogId});
    }
  }
});

// Show image in a lightbox with magnificPopup plugin
Template.postItem.rendered = function(){


    var drawing = document.getElementById("canvas-"+this.data.imageId);
    var con = drawing.getContext("2d");
    var goofyPic = document.getElementById("img-"+this.data.imageId);
    con.drawImage(goofyPic, 0, 0, 400, 350);

    var pin = { x: "40", y: "70", color: "red" };
    
    con.save();
    con.translate(pin.x,pin.y);

    con.beginPath();
    con.moveTo(0,0);
    con.bezierCurveTo(2,-10,-20,-25,0,-30);
    con.bezierCurveTo(20,-25,-2,-10,0,0);
    con.fillStyle=pin.color;
    con.fill();
    con.strokeStyle="black";
    con.lineWidth=1.5;
    con.stroke();
    con.beginPath();
    con.arc(0,-21,3,0,Math.PI*2);
    con.closePath();
    con.fillStyle="black";
    con.fill();

    con.restore();


   /*
    var image2 = new Image();
    image2.src = "andyGoofy.gif";
    con.drawImage(image2, 100, 100, 70, 50);
*/


    // Set default author
  if (!Session.get(Template.parentData(1).blog._id))
  {
    Session.set(Template.parentData(1).blog._id, {author: 'Invité'});    
  }

  $('.post-item--image-wrapper').imagesLoaded(function(){
    $('.post-item--image-link').magnificPopup({
      type:'image',
      closeOnContentClick:'true',
    });
  });
}


