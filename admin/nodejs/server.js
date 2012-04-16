var isPanicMode = false;


function Screen(id, name, channel, connection) {
	this.id = id;
	this.name = name;
	this.channel = channel;
	this.connection = connection;
	
	this.setChannel = function(newChannel) {
		channel = newChannel;
	}
	
	this.sendChannel = function() {
		if(isPanicMode) {
			console.log("Panic mode. Only send panic channel");
			fs.readFile("../../channels/panic.json", 'utf8', function(err, data) {
				if(err) {
					connection.send("No data available");
				}
				else prepareChannelFileForDelivery(connection, data);
			});
		}
		else {
			fs.readFile("../../channels/" + channel + ".json", 'utf8', function (err, data) {
				if (err) {
					console.log("Looking for default");
					fs.readFile("../../channels/default_channel.json", 'utf8', function (err, data) {
						if(err) {
							//Send no data
							connection.send("No data available");
						}
						else prepareChannelFileForDelivery(connection, data);
				
					});
				}
				else prepareChannelFileForDelivery(connection, data);
			});
		}
	}
}

var screens = [];

function getScreen(connection) {
	for(i = 0; i < screens.length; i++) {
		if(connection === screens[i].connection) {
			return screens[i];
		}
	}
}

function removeConnection(connection) {
	for(i = 0; i < screens.length; i++) {
		if(connection === screens[i].connection) {
			console.log("Screen " + screens[i].name + " disconnected.");
			screens.splice(i, 1);
			break;
		}
	}
}

function setScreenName(connection, name) {
	for(i = 0; i < screens.length; i++) {
		if(connection === screens[i].connection) {
			console.log(screens[i].name + " changed name to " + name);
			screens[i].name = name;
			break;
		}
	}
}

var WebSocketServer = require('websocket').server;
var async = require('async');
var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*'});
    
    var url_parts = url.parse(request.url, true);
    
    //List all connected screens
    if(url_parts.pathname == '/listscreens' || url_parts.pathname == '/listscreens/'){
    	var connectedScreens = "";
    
		for(i = 0; i < screens.length; i++) {
			connectedScreens += screens[i].name + ";";
		}
		
		connectedScreens = connectedScreens.substring(0, connectedScreens.length-1);
		
		response.end(connectedScreens);
    }
    
    //Send panic template
    else if(url_parts.pathname == "/panic" || url_parts.pathname == "/panic/"){
    	var query = url_parts.query;
    	
    	//Send panic to user, bla bla bla
    	if(query['screen'] != undefined){
    		
    		if(query['screen'] == '*'){
				//Panic to all users, also users that connect later, 
				//thus set panicMode to true.
				isPanicMode = true;

    			console.log("Sending panic feeds to all screens");
				var i;
				for(i = 0; i < screens.length; i++)
				{
					screens[i].setChannel("panic");
					screens[i].sendChannel();
				}
    		}
    		else {
				console.log("Sending panic feeds to: " + query['screen']);
				var i;
				for(i = 0; i < screens.length; i++)
				{
					if(query['screen'] == screens[i].name)
						screens[i].setChannel("panic");
						screens[i].sendChannel();
				}
    		}
    	}
    	response.end("Panic sent to: " + query['screen']);
    }

	else if(url_parts.pathname == "/unPanic" || url_parts.pathname == "/unPanic/") {
		isPanicMode = false;
		response.end("Set panic mode to false");
	}
    
    //Set template
    else if(url_parts.pathname == "/set/") {
    	var query = url_parts.query;
    	if(query['screen'] != undefined && query['channel'] != undefined) {
    		console.log("Sending " + query['channel'] + " to: " + query['screen']);
    		for(var i = 0; i < screens.length; i++) {
    			if(screens[i].name == query['screen'])
    				screens[i].setChannel(query['channel']);
    				screens[i].sendChannel();
    		}
    		response.end("Set template: " + query['channel'] + " to: " + query['screen']);
    	}
    }

	else if(url_parts.pathname == "/isPanic/" || url_parts.pathname == "/isPanic") {
		response.end("Is Panic: " + isPanicMode);
	}
});
server.listen(8081, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
	

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
			if(message.utf8Data.substring(0, 7) == "Connect")
			{
				var name = message.utf8Data.substring(9, message.utf8Data.length);
				var screen = new Screen(1, name, name, connection);
				screens.push(screen);
				console.log("Screen " + screen.name + " connected.");
				
				screen.sendChannel();
			}
        }
    });

    connection.on('close', function() {
        // close user connection
        removeConnection(connection);
    });
});


function ContentItem(title, content, date, type, note, priority, expireTime, displayTime) {
	this.title = title;
	this.content = content;
	this.date = date;
	this.type = type;
	this.note = note;
	this.priority = priority;
	this.expireTime = expireTime;
	this.displayTime = displayTime;
}

function Channel(name, note, mainContent, subContent) {
	this.name = name;
	this.note = note;
	this.mainContent = mainContent;
	this.subContent = subContent;
	
	this.sendJson = function(connection) {
	
		console.log("Done!");
	
		async.parallel([
		    function(callback){
				parseContent(mainContent, callback);
		    },
		    function(callback){
				parseContent(subContent, callback);
		    },
		],
		// optional callback
		function(err, results){
		    // the results array will equal ['one','two'] even though
		    // the second function had a shorter timeout.
		    console.log("Parsed: " + results);
		});

	}
}

function parseContent(content, callback) {
		var sources = []; //This is where the sources are temp. stored before doing http get
		var resultItems = [];
		//For some reason JSON.parse doesnt want to parse the feeds together.
		var startIndex = 0;
		var stopIndex = 0;
		//Go through main content to separate the feeds from each other.
		while(stopIndex < content.length) {
			startIndex = content.indexOf("{", stopIndex);
			stopIndex = content.indexOf("}", startIndex) + 1;
			if(startIndex == -1)
				break;
			
			var source = JSON.parse(content.substring(startIndex, stopIndex));
			sources.push(source);
		}
		
		var options = {
			   host: 'localhost',
			   port: 80,   
			   path: '/dbt/services/FeedFetcher.php?sources=' + encodeURI(sources)
		};
		
		var result = "";
		
		var req = http.get(options, function(res) {  
		 	res.setEncoding('utf8');
		 	
			res.on('data', function(chunk) {
				result += chunk; 
				console.log("Chunk  " + chunk);
			}).on('end', function() {
				
				console.log("Fetched " + result);
				
				callback(null, result);
				
			});   
		}).on('error', function(e) {  
			console.log("Got error: " + e.message);   
		});
			
		
}

function getSource(source, callback) {
	
}	

function prepareChannelFileForDelivery(connection, channel) {
	var jsonObject = JSON.parse(channel);
	
	var name = jsonObject.name;
	var note = jsonObject.note;
	var mainContent = jsonObject.maincontent;
	var subContent = jsonObject.subcontent;
	
	var channel = new Channel(name, note, mainContent, subContent);
	
	var feed = channel.sendJson(connection);
	
	//console.log(feed);
	//connection.send(feed);
	
	
	/*
	var mainFeed = ""; var subFeed = "";
	
	var options = {
           host: 'localhost',   
           port: 80,   
           path: '/dbt/services/RSSFetcher.php?feeds=' + mainContent
      };
	var req = http.get(options, function(res) {  
	 	res.setEncoding('utf8');
		res.on('data', function(chunk) {  
		    mainFeed += chunk;
		    
		    
			}).on('end', function() {
				var options2 = {
			   		host: 'localhost',   
			   		port: 80,   
			   		path: '/dbt/services/RSSFetcher.php?feeds=' + subContent
		  		};
				var req2 = http.get(options2, function(res2) {  
				 	res2.setEncoding('utf8');
					res2.on('data', function(chunk) {
						subFeed += chunk;
				
						}).on('end', function() {
							var feed = '{' + '"name":"' + name + '","maincontent":' + mainFeed + ',"subcontent":' + subFeed + "}";
							connection.send(feed);
					}).on('error', function(e) {
						  console.log("Got error: " + e.message);
					});  
				}); 
	}).on('error', function(e) {
		  console.log("Got error: " + e.message);
	});
	});*/
	
}


 

