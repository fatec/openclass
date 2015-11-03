#####################
BlogPage
#####################

Subscriptions:
posts du jounal Posts.find({blogId: blog.id}, {$in: {blog.posts}})
tags du journal
images des posts en question
authors
categories

Journal:
{
	_id
	title
	creator
	code
	created
	posts:{
		id
		version
	}
}

Action:
-> PostSumit 
-> PostEdit 

-> PostsDelete
-> Filter



#####################
PostSubmit
#####################

Subscription:
User (current user)
Authors (du blogID)
Categories (du blogID)
Tags (tags déjà créé avec ce blogId)

Actions:
-> Ajouter image (imageId: )
-> Editer metadonnées image
-> Editer légende
-> Editer tags
-> Changer auteur
-> Séléctionner catégorie
--> Poster (imageId, tags, categorie, author) 
(puis ajout depuis le serveur de:
	created
	posts = posts+{id}
)

Post:
{
	_id
	originalId
	author
	body
	blogId
	imageId
	tags: [tag1, tag2, ...]
	category
	userId/authorId
	created
	version
}
