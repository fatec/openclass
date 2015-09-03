AutoForm.addHooks(
  ["insertPostForm"],
  {
    before   : {
      method: CfsAutoForm.Hooks.beforeInsert
    },
    after    : {
      method: CfsAutoForm.Hooks.afterInsert
    }
  }
);


/*var postHooks = {
    before: {
        insert: function(doc, template) {
            console.log("On est dans le before insert..");
            if(Meteor.userId()){
                user = Meteor.user();
                doc.userId = user._id;
                doc.author = user.name;
                doc.blogId = this.formAttributes.dataForHook.blogId;
            }
            return doc;
        },
        update: function(doc, template) {
            //console.log("On va transformer la chaine "+doc.$set.tags +" en tableau");
            console.log("On va mettre à jour.. "+doc.$set.tags);
            //if (typeof doc.$set.tags === "string") {
            //    doc.$set.tags = doc.$set.tags.split(", ");
            //}
            if(Meteor.userId()){
                doc.$set.modified = new Date();
            }
            return doc;
        }
    },
    after: {
        // Replace `formType` with the form `type` attribute to which this hook applies
        insert: function(error, result) {
            console.log("On a fini l'insert.. on doit encore ajouter les champs qu'il faut à l'image");
            console.log("Notre nouveau postId est "+this.doc)
            var post = Posts.findOne(this.doc);
            if (post.imageId) {
              Images.update({_id: post.imageId}, {$set: {'metadata.postId': post._id, 'metadata.blogId': post.blogId}});
            }
            //Router.go('blogPage', {_id: this.formAttributes.dataForHook.blogId});
        }
    },
    docToForm: function(doc) {
        if (_.isArray(doc.tags)) {
            doc.tags = doc.tags.join(", ");
        }
        return doc;
    },
    formToDoc: function(doc) {
        if (typeof doc.tags === "string") {
            doc.tags = doc.tags.split(", ");
        }
        return doc;
    },
    onSuccess: function(formType, result) {             
        console.log(formType, result);
        this.resetForm();
    },
    onError: function(formType, error) {
        console.log(formType, error)
    }

}

AutoForm.addHooks(['insertPostForm','editPostForm'], postHooks);
*/
