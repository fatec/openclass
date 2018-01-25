Template.postSubmit.onCreated(function() {

		if (Session.get("fileId"))
			delete Session.keys["fileId"]; // Clear fileId session

		if (Session.get("fileExt"))
			delete Session.keys["fileExt"]; // Clear fileExt session
});


Template.postSubmit.onRendered(function() {

	$('.post-submit--textarea').autosize(); // Set textarea height automatically according to text size

	Deps.autorun(function() { // Autorun to reactively update subscription of file
		if (Session.get("fileId"))
			Meteor.subscribe('file', Session.get("fileId"));
	});

	Uploader.finished = function(index, fileInfo, templateContext) { // Triggered when file upload is finished
	// TODO : don't upload file before submit post (or remove after if post isn't submitted)	
		Session.set("fileId",fileInfo.name);

		var extension = fileInfo.name.substr(fileInfo.name.lastIndexOf('.')+1).toLowerCase();
		Session.set("fileExt",extension);
	}

	// Set default author if not defined
	if (Template.parentData(2))
		if (!Session.get(Template.parentData(2).blog._id))
			Session.set(Template.parentData(2).blog._id, {author: 'Invité'});    

	// var tags = new Bloodhound({ // Allow to find and show tags in input if already exists
	// 	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
	// 	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// 	local: Tags.find().fetch()
	// });
	// tags.initialize();

	// $('.suggest').tagsinput({
	// 	typeaheadjs: {
	// 		name: 'tags',
	// 		displayKey: 'name',
	// 		valueKey: 'name',
	// 		source: tags.ttAdapter(),
	// 	}, 
	// 	confirmKeys: [32, 9, 13, 44, 188]
	// });

	// $('.suggest').tagsinput('input').blur(function() {
	// 		$('.suggest').tagsinput('add', $(this).val().toLowerCase());
	// 		$(this).val('');
	// })
});


Template.postSubmit.events({

	'submit form': function(e, template) {
		 e.preventDefault();

		$(".post-submit--button-spinner").show(); // Show a spiner while sending
		$(".post-submit--button-icon").hide();
		$(".post-submit--button-text").hide();

			
		var author = Session.get(this.blog._id).author;  
		var body = $(e.target).find('[name=body]').val();
		var blogId = template.data.blog._id;
		var fileId = Session.get("fileId");
		var fileExt = Session.get("fileExt");
		//var tags = $(e.target).find('[name=tags]').val().toLowerCase().replace(/ /g,'').split(',');
		var category = $(e.target).find('[name=category]').val();

		// TODO : check how imagesToDelete work
		// var imagesToDelete = Session.get('imagesToDelete');
		// imagesToDelete.forEach(function(imageId) {
		// 		Images.remove(imageId);
		// });
		 
		Meteor.call('postInsert', {author: author, body: body, blogId: blogId, fileId: fileId, fileExt: fileExt, category: category}, function(error, postId) {
			if (error){
	          	alert("Une erreur est survenue : "+error.message);
			} else {
				$.magnificPopup.close();

				// if (tags)
				// 	Meteor.call('tagsInsert', {blogId: blogId, tags: tags});
				//Router.go('blogPage', {_id: post.blogId, last: true});
			};
		});
	},
	'click .post-submit--button-submit': function(e) {
		e.preventDefault();
		$('#post-submit--form').submit();
	},
	'click .post-submit--button-delete-image': function(e) {
		e.preventDefault();
		if (confirm("Effacer l'image?")) {
			Session.set('fileId', false);
		}  
	}
});


Template.postSubmit.helpers({

	file: function() {
		if (Session.get("fileId")) {
			var fileId = Session.get("fileId");
			var fileInCollection = Files.findOne({fileId:fileId});

			if (fileInCollection) // Wait until file is in Files collection
				$(".post-submit--button-submit").show();
			return fileInCollection;
		}
		else
			return false;
	},
	categories: function() {
		return Categories.find({blogId: this.blog._id},{sort: { name: 1 }});  
	} 
});