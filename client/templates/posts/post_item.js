Template.postItem.helpers({
  image: function() {
/*  	console.log("Les données dispo ici: ");
  	console.log("body: "+ this.body);
  	console.log("blogId: "+this.blogId);
  	console.log("_id: "+this._id);*/
  	//return "coucou";
  	//return Images.findOne();
    return Images.findOne({'metadata.blogId': this.blogId, 'metadata.postId': this._id});
  }
});


/*
	<a href="{{image.url store='images'}}" target="_blank"><img src="{{image.url store='thumbs' uploading='/images/uploading.gif' storing='/images/storing.gif'}}" alt="" class="thumbnail" /></a>
*/