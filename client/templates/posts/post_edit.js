Template.postEdit.onRendered(function() {

	$('.post-edit--textarea').autosize(); // Set textarea height automatically according to text size

	Session.set('imageId', false);
	if (this.data.post.imageId) // If image already exist, set imageId in session
		Session.set('imageId', this.data.post.imageId);

	Deps.autorun(function() { // Autorun to reactively update subscription of image
		if (Session.get("imageId"))
			Meteor.subscribe('image', Session.get("imageId"));
	});

	Uploader.finished = function(index, fileInfo, templateContext) { // Triggered when image upload is finished
	// TODO : don't upload image before submit post (or remove after if post isn't submitted)	
		Session.set("imageId",fileInfo.name);
	}

	var tags = new Bloodhound({ // Allow to find and show tags in input if already exists
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: Tags.find().fetch()
	});
	tags.initialize();
	$('.suggest').tagsinput({
		typeaheadjs: {
			name: 'tags',
			displayKey: 'name',
			valueKey: 'name',
			source: tags.ttAdapter()
		}, 
		confirmKeys: [32, 9, 13, 44, 188]
	});

	$('.suggest').tagsinput('input').blur(function() {
		$('.suggest').tagsinput('add', $(this).val().toLowerCase());
		$(this).val('');
	});
});


Template.postEdit.events({

	'submit form': function(e) {
		e.preventDefault();

		$(".post-edit--button-spinner").show(); // Show a spiner while sending
		$(".post-edit--button-icon").hide();
		$(".post-edit--button-text").hide();
	
		var currentPostId = this.post._id;
		var currentPost = Posts.findOne(currentPostId);

		var oldTags = this.post.tags;
		var newTags = $(e.target).find('[name=tags]').val().toLowerCase().replace(/ /g,'').split(',');
		var set = {tags: newTags};

		var body = $(e.target).find('[name=body]').val();
		if (body != this.post.body) // If body has changed, replace by new one
			_.extend(set, {body: body});

		var category = $(e.target).find('[name=category]').val();
		if (category != this.post.category) {
			_.extend(set, {category: category})

			var oldCategoryItem = Categories.findOne({blogId: blogId, name: this.post.category}); // Decrement category
			if (oldCategoryItem)
				Categories.update(oldCategoryItem._id, {$inc: {nRefs: -1}}); 

			var newCategoryItem = Categories.findOne({blogId: blogId, name: category}); // Increment category
			if (newCategoryItem)
				Categories.update(newCategoryItem._id, {$inc: {nRefs: 1}});    
		}

		// TODO : don't remove an image before form is submitted (check old git commits)

		var imageId = Session.get("imageId");
		_.extend(set, {imageId: imageId});

		Posts.update(currentPostId, {$set: set}, function(error) {
			if (error) {
          		alert("Une erreur est survenue : "+error.message);
			} else {
				Meteor.call('tagsEdit', {blogId: blogId, newTags: newTags, oldTags: oldTags}, function(error) {
					if (error) {
          				alert("Une erreur est survenue : "+error.message);
					} else {						
						Router.go('blogPage', {_id: currentPost.blogId});  
					}
			 	});
			}
		});
	},
	'click .post-edit--button-submit': function(e) {
		e.preventDefault();
		$('#post-edit--form').submit();
	},
	'click .post-edit--button-delete-image': function(e) {
		e.preventDefault();
		if (confirm("Effacer l'image?")) {
			Posts.update(this.post._id, {$unset: {'imageId': ''}});
			Session.set('imageId', false);
		}
	}
});


Template.postEdit.helpers({
	
	image: function() {
		if (Session.get("imageId")) {
			var imageId = Session.get("imageId");
			var imageInCollection = Images.findOne({imageId:imageId});

			if (imageInCollection) // Wait until image is in Images collection
						$(".post-edit--button-submit").show();
			return imageInCollection;
		}
		else
			return false;
	},
	blog: function() {
		var currentPostId = this.post._id;
		var currentPost = Posts.findOne(currentPostId);
		var blogId = Blogs.findOne(currentPost.blogId);
		return blogId;
	},
	categories: function() {
    	return Categories.find({blogId: this.post.blogId},{sort: { name: 1 }});  
  	},
	selectedCategory: function(){
		var category = this.name;
		var categoryItem = Template.parentData().post.category;
		return category === categoryItem;
	}
});