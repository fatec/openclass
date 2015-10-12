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



var img = Images.findOne(this.data.imageId);
var goofyPic = document.getElementById("img-"+this.data.imageId);
// create a wrapper around native canvas element (with id="c")
var canvas = new fabric.Canvas("canvas-"+this.data.imageId);



//canvas.setBackgroundImage(img.url({store: "thumbs"});
// On peut aussi redimensionner l'image 
canvas.setBackgroundImage(img.url({store: "thumbs"}), canvas.renderAll.bind(canvas), {

    scaleY: canvas.height / 400,
    scaleX: canvas.width / 400,

       });

/*
if (img.metadata.canvasObjects) {
  console.log("Il y a deja des objets sur le canvas sauvegardés");
  var canvasObjects = img.metadata.canvasObjects;
} else {
  console.log("Il n'y a pas de canvasObjects");
  var canvasObjects = {"objects":[{"type":"text","originX":"left","originY":"top","left":100,"top":100,"width":119.1,"height":39.32,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(0,0,0,0.5)","blur":5,"offsetX":5,"offsetY":5},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"mon texte","fontSize":30,"fontWeight":"normal","fontFamily":"Comic Sans","fontStyle":"","lineHeight":1.16,"textDecoration":"","textAlign":"left","textBackgroundColor":""},{"type":"rect","originX":"left","originY":"top","left":100,"top":100,"width":20,"height":20,"fill":"red","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"triangle","originX":"left","originY":"top","left":50,"top":50,"width":20,"height":30,"fill":"blue","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":""};
}
//canvas.loadFromJSON('{"objects":[{"type":"rect","left":50,"top":50,"width":20,"height":20,"fill":"green","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":false,"transparentCorners":true,"perPixelTargetFind":false,"rx":0,"ry":0},{"type":"circle","left":100,"top":100,"width":100,"height":100,"fill":"red","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"selectable":true,"hasControls":true,"hasBorders":true,"hasRotatingPoint":false,"transparentCorners":true,"perPixelTargetFind":false,"radius":50}],"background":"rgba(0, 0, 0, 0)"}');
canvas.loadFromJSON(canvasObjects);
*/

var map_pin_fill = '<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'><svg height="32px" style="enable-background:new 0 0 20 32;" version="1.1" viewBox="0 0 20 32" width="20px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Layer_1"/><g id="map_x5F_pin_x5F_fill"><g><g><path d="M17.07,2.93c-3.906-3.906-10.234-3.906-14.141,0c-3.906,3.904-3.906,10.238,0,14.141     c0,0,7.066,6.93,7.066,14.93c0-8,7.074-14.93,7.074-14.93C20.977,13.168,20.977,6.834,17.07,2.93z M9.996,14.006     c-2.207,0-3.996-1.789-3.996-4s1.789-4,3.996-4c2.215,0,4.004,1.789,4.004,4S12.211,14.006,9.996,14.006z" style="fill:#4E4E50;"/></g></g></g></svg>';


//var path = fabric.loadSVGFromURL('/img/map_pin_fill.svg', function(objects, options) {
fabric.loadSVGFromString(map_pin_fill, function(objects, options) {
  var shape = fabric.util.groupSVGElements(objects, options);
      if (shape.isSameColor && shape.isSameColor() || !shape.paths) {
      shape.setFill("blue");
    }
    else if (shape.paths) {
      for (var i = 0; i < shape.paths.length; i++) {
        shape.paths[i].setFill("blue");
      }
    }
//console.log("shape "+shape);
  canvas.add(shape).renderAll();
});

var string = JSON.stringify(canvas);
console.log("Le canvas "+string);

//canvas.item(0).sourcePath = '/img/map_pin_fill.svg';
console.log("Version 2 "+JSON.stringify(canvas.toDatalessJSON()));

/*
var comicSansText = new fabric.Text("mon texte", {shadow: 'rgba(0,0,0,0.5) 5px 5px 5px', fontSize: 30,
  fontFamily: 'Comic Sans', left: 100, top: 100 }); 

canvas.add(comicSansText);

//canvas.backgroundImage = "http://lorempixel.com/300/350/";

/*
// Ajoute l'image au canevas et la rend non selectionnable
fabric.Image.fromURL(img.url({store: "thumbs"}), function(oImg) {

  oImg.set('selectable', false); // make object unselectable
  canvas.add(oImg);
});
*/

//console.log("url "+img.url({store: "thumbs"}));
//canvas.backgroundImage = img.url({store: "thumbs"});
/*
// create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 20,
  height: 20
});



var triangle = new fabric.Triangle({
  width: 20, height: 30, fill: 'blue', left: 50, top: 50
});

canvas.add(rect, triangle);

/*
canvas.on('mouse:down', function(options) {
  if (options.target) {
    console.log('an object was clicked! ', options.target.type);
  }
});
triangle.on('moving', function() {
  console.log('moving triangle');
});
*/


/*
var rwidth = rect.getWidth(); // 0
var rheight = rect.getHeight(); // 0

var rleft = rect.getLeft(); // 0
var rtop = rect.getTop(); // 0

var rfill = rect.getFill(); // rgb(0,0,0)
var rstroke = rect.getStroke(); // null

var ropacity = rect.getOpacity(); // 1

//console.log("coordonnées du rectangle : "+rwidth+", "+rheight+", "+rleft+", "+rtop+", "+rfill+", "+rstroke+", "+ropacity);
var string = JSON.stringify(canvas);
console.log("Le canvas "+string);

/*

    var drawing = document.getElementById("canvas-"+this.data.imageId);
    var con = drawing.getContext("2d");
    var goofyPic = document.getElementById("img-"+this.data.imageId);
    con.drawImage(goofyPic, 0, 0, 400, 350);

    // save the pins in mongo
    var pin = { x: "40", y: "70", color: "red" };
    

    // On edit page make pins moveable and allow add / delete them
    // Maybe use:
    // https://atmospherejs.com/ryanswapp/fabricjs
    // https://atmospherejs.com/philippspo/reactive-canvas
    //
    // Peut être un outil pour faire des crop pourra être utile aussi..
    // https://atmospherejs.com/digz6666/image-crop-canvas
    // https://atmospherejs.com/jonblum/jquery-cropper
    //
    // Ca c'est joli.. 
    // https://atmospherejs.com/overture8/wordcloud2
    // 
    // Pour un module de vote il faudra plutot
    // https://atmospherejs.com/chart/chart
    // https://atmospherejs.com/mrt/chartjs
    // 
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

*/
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


