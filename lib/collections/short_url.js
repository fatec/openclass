ShortUrls = new Mongo.Collection('shorturls');

/*
url:
blogId:
*/

/*

newshortUrl(blogId, shortUrl, i) 
si i = 0
  var toAppend = ''
else
  var toAppend = '-'+i

si shortUrl != undefined (on propose un shortUrl)
  -> si shortUrl+toAppend existe deja dans la table des shortUrls
      newshortUrl(blogId, shortUrl, i+1)
    else
      shortUrl.insert(blogId, shortUrl+toAppend)
      return shortUrl+toAppend

// 
> var blog = Blogs.findOne()._id;
> var short1 = Meteor.call('newShortUrl', blog, "demo");
> short1
'demo'
> var short-encore1 = Meteor.call('newShortUrl', blog, "demo");
> short-encore1
'demo'
> var short2 = Meteor.call('newShortUrl', autreblog, "demo");
> short2
'demo-1'
> var short3 = Meteor.call('newShortUrl', encoreunautreblog, "demo");
> short3
'demo-2'


*/

Meteor.methods({
  newShortUrl: function(blogId, shortUrl, increment) {
  	var urlExists = ShortUrls.findOne({blogId: blogId});
  	if ( urlExists !== undefined ) {
  		return exists.url;
  	} else {
  	  	if (typeof increment == 'undefined') {
  	  		increment = 0;
  	  		var toAppend = "";
  	  	} else {
  	  		var toAppend = "-"+increment;
  	  	}
  	  	if (ShortUrls.findOne({url: shortUrl+toAppend}) !== undefined ) {
  	        return Meteor.call('newShortUrl', blogId, shortUrl, increment+1 );
  	  	} else {
  	  		// ShortUrls.insert({blogId: blogId, url: shortUrl+toAppend});
  	  		return shortUrl+toAppend
  	  	}
  	  }
  }
})

// before insert 
// avant d'inserer le short url on remplace la valeur de url par Meteor.call('newShortUrl', blogId, shortUrl)
// pour être sûr d'avoir un short url unique