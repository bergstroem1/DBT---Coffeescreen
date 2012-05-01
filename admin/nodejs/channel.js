var async = require('async');
var http = require('http');

function Channel(name, note, mainContent, subContent) {
	this.name = name;
	this.note = note;
	this.mainContent = mainContent;
	this.subContent = subContent;
	
	this.sendJson = function(connection) {
		async.parallel([
		    function(callback){
				parseContent(mainContent, callback);
		    },
		    function(callback){
				parseContent(subContent, callback);
		    },
		],
		//Callback after both above functions are done.
		function(err, results){
		    //console.log("Parsed: " + results);
		    var mainFeed = results[0];
		    var subFeed = results[1];
		    
		    var feed = '{'
			+ '"name":"' + name + '","maincontent":' + mainFeed + ',"subcontent":' + subFeed + "}";
		    connection.send(feed);
		});
	}
}

function parseContent(content, callback) {
		
		var options = {
			   host: 'localhost',
			   port: 80,   
			   path: '/dbt/services/FeedFetcher.php?sources=' + encodeURI(content)
		};
		
		var result = "";
		
		var req = http.get(options, function(res) {  
		 	res.setEncoding('utf8');
		 	
			res.on('data', function(chunk) {
				result += chunk; 
			}).on('end', function() {
				
				console.log("Fetched " + result);
				
				callback(null, result);
				
			});   
		}).on('error', function(e) {  
			console.log("Got error: " + e.message);   
		});
			
		
}

this.prepareChannelFileForDelivery = function(connection, channel) {
	var jsonObject = JSON.parse(channel);
	
	var name = jsonObject.name;
	var note = jsonObject.note;
	var mainContent = jsonObject.maincontent;
	var subContent = jsonObject.subcontent;
	
	var channel = new Channel(name, note, mainContent, subContent);
	
	var feed = channel.sendJson(connection);
	
}

