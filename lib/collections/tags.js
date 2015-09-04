Tags = new Mongo.Collection('tags');

//Meteor.call('tagsInsert', {blogId: blogId, tags: tags} );
Meteor.methods({
  tagsInsert: function(postAttributes) {
    console.log("On veux ajouter les tags dans la collection (ici on est sur le serveur");
    console.log("postAttributes "+Object.keys(postAttributes));
    // blogId & tags
    console.log("tags "+"("+postAttributes.tags.length+") : "+postAttributes.tags);
    console.log("blogId "+postAttributes.blogId);
    

    // On pourrait vérifier que le blogId correspond bien au blogId du post

    // Pour chaque tag du tableau tags 
    postAttributes.tags.forEach(function(tag) {
      item = Tags.findOne({name: tag, blogId: postAttributes.blogId});
      if(item){
        console.log("Il y a déjà le tag "+tag+" dans le blog "+Blogs.findOne(postAttributes.blogId).title);
        Tags.update(item, {$inc: {nRefs: 1}});
      }
      else{
        console.log("Il n'y a pas encore le tag "+tag+" dans le blog "+Blogs.findOne(postAttributes.blogId).title);
        Tags.insert({name: tag, blogId: postAttributes.blogId, nRefs: 1});
      }

    });
    
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