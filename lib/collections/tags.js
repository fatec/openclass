Tags = new Mongo.Collection('tags');

//Meteor.call('tagsInsert', {blogId: blogId, tags: tags} );
Meteor.methods({
  tagsInsert: function(tagsAttributes) {
    console.log("On veux ajouter les tags dans la collection (ici on est sur le serveur");
  }

});


/*
Lors de la création des tags
Tags.add(blogId, tag)
	Si !tag alors on ajoute blogId, tag, nRefs=1
	Si tag alors nRefs+=1 et on ajoute blogId au tableau blogs s'il n'y est pas deja 

*/

/*
Tags.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 60
  },
  blogId: {
    type: String,
    label: "Blog Id"
  },
  nRefs: {
    type: Number,
    label: "Number of references",
    min: 0
  }
}));
*/