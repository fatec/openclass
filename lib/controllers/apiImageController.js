ApiImageController = RouteController.extend({
	
	action: function() {
		this.response.statusCode = 200;
		this.response.setHeader("Content-Type", "application/json");
		this.response.setHeader("Access-Control-Allow-Origin", "*");
		this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

		console.log("REST : image : On recoit les informations suivantes "+Object.keys(this.request.body));
		var reponse = "";
		Meteor.call('imageCopy',this.request.body, function(error, result) {
			if(error){
		    	reponse = {status: 'fail', params: {message: 'Zut ca ne marche pas..!', error: error}}
		    } else {
		      //console.log("REST : taille de result "+ result.length);
		    	reponse =  {status: 'success', params: {message: "C'est envoyé.. mais peut être tout a planté? :D", result: result}};
		    }
		});
		this.response.end(JSON.stringify(reponse));
	}
});
