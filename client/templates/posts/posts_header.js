  Template.postsHeader.helpers({
  	ownBlog: function() {
		if (this.blog.userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), ['admin']) === true)    		return true;
  	},
	authors: function() {
		return Authors.find({blogId: this.blog._id, isUser: {$not: true}});  
	},  
	optionIsSelected: function(authorName) {
		return authorName === Session.get(Template.parentData().blog._id).author;
	}  
});

  Template.postsHeader.events({
	'change .header--select-author': function(event) {
		event.preventDefault();
		// var password = prompt("Entrez le mot de passe pour l'utilisateur "+$(event.target).val());
		// if (password == "admin")
		 	Session.set(this.blog._id, {author: $(event.target).val()});
		// else
		// {
			//Session.set(this.blog._id, {author: "Invité"});	
			//console.log($('.header--select-author option[value="Invité"]'));
			//$('.header--select-author option[value="Invité"]').prop('selected', true);
		//}
	} 
});