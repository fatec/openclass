Tags = new Mongo.Collection('tags');

//Meteor.call('tagsInsert', {blogId: blogId, tags: tags} );
Meteor.methods({
  tagsInsert: function(postAttributes) {
    //console.log("On veux ajouter les tags dans la collection (ici on est sur le serveur");
    //console.log("postAttributes "+Object.keys(postAttributes));
    // blogId & tags
    //console.log("tags "+"("+postAttributes.tags.length+") : "+postAttributes.tags);
    //console.log("blogId "+postAttributes.blogId);
    

    // On pourrait vérifier que le blogId correspond bien au blogId du post

    // Pour chaque tag du tableau tags 
    postAttributes.tags.forEach(function(tag) {
      var tag=tag.trim();
      if (tag!="") {
        var item = Tags.findOne({name: tag, blogId: postAttributes.blogId});
        //console.log("Tags.findOne({name: '"+tag+"', blogId: '"+postAttributes.blogId+"''});")
        if(item){
          //console.log("Il y a déjà le tag "+tag+" dans le blog "+Blogs.findOne(postAttributes.blogId).title+" alors on l'incrémente");
          Tags.update(item, {$inc: {nRefs: 1}});
        }
        else{
          //console.log("Il n'y a pas encore le tag "+tag+" dans le blog "+Blogs.findOne(postAttributes.blogId).title+" alors on l'ajoute");
          Tags.insert({name: tag, blogId: postAttributes.blogId, nRefs: 1});
        }
      }
    });
    
  },

  // dans tagUpdate il faut vérifier si il y a des tags en moins pour diminuer le nRefs..
  tagsEdit: function(postAttributes) {
    //console.log("les anciens tags "+"("+postAttributes.oldTags.length+") : "+postAttributes.oldTags);
    //console.log("les nouveaux tags "+"("+postAttributes.newTags.length+") : "+postAttributes.newTags);
    //console.log("blogId "+postAttributes.blogId);

    var oldTags = postAttributes.oldTags;
    var newTags = postAttributes.newTags;
    var blogId = postAttributes.blogId;

    // On prend ce qui est commun dans les 2 tableaux:
    var intersection = _.intersection(oldTags, newTags);

    // Tags ajoutés: newTags - intersection
    var addTags = _.difference(newTags, intersection);
    //console.log("On veux ajouter "+addTags.length+" tags: "+addTags)
    if (addTags.length > 0){
      addTags.forEach(function(tag) {
        var tag=tag.trim();
        if (tag!="") {    
          var item = Tags.findOne({blogId: blogId, name: tag});
          // si le tag est présent seulement dans le tableau nouveau tags (ca veux dire qu'on l'ajoute)
          //console.log("On ajoute le tag "+tag);
          if(item){
            Tags.update(item, {$inc: {nRefs: 1}});
          }
          else{
            Tags.insert({name: tag.trim(), blogId: blogId, nRefs: 1});
          }
        }
      });      
    }


    // Tags enlevés: oldTags - intersection
    var removeTags = _.difference(oldTags, intersection);
    //console.log("On veux enlever "+removeTags.length+" tags: "+removeTags);
    if (removeTags.length > 0) {
      removeTags.forEach(function(tag) {
        var tag=tag.trim();
        var item = Tags.findOne({blogId: blogId, name: tag});
        if (item){
          //console.log("On enlève le tag "+tag+" qui a "+item.nRefs+" reférences");
          if (item.nRefs>1) {
            // On diminue de 1 le nref
            Tags.update(item, {$inc: {nRefs: -1}});
          } else {
            // c'était le dernier et on efface ce tag
            Tags.remove(item);
          }
        } else {
          console.log("là c'est le BUG dans les tags.. voilà la requête qui devrait retourner au moins "+removeTags.length+" element");
          console.log("Tags.findOne({name: '"+tag+"', blogId: '"+blogId+"'});");
        }
      });      
    }


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