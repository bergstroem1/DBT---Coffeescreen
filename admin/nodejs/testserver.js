function Screen(id, name, connection) {
	this.id = id;
	this.name = name;
	this.connection = connection;
}

var screens = [];

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
			//console.log("Screen " + screens[i].name + " disconnected.");
			screens[i].name = name;
		}
	}
}

var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
    response.writeHead(200, {'Content-Type': 'text/plain'});
    
    var connectedScreens = "";
    
    for(i = 0; i < screens.length; i++) {
    	connectedScreens += screens[i].name + ";";
    }
    
    connectedScreens = connectedScreens.substring(0, connectedScreens.length-1);
    
    response.end(connectedScreens);
});
server.listen(8080, function() { });

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
				var screen = new Screen(1, name, connection);
				screens.push(screen);
				console.log("Screen " + screen.name + " connected.");
				
				
				fs.readFile(name, 'utf8', function (err, data) {
  					if (err) {
  						console.log("Looking for default");
	  					fs.readFile("default_template", 'utf8', function (err, data) {
	  						if(err) {
	  							//Send no data
	  							connection.send("No data availible");
	  						}
	  						else connection.send(data);
	  						
	  					});
	  				}
	  				else connection.send(data);
				});
			}
        }
    });

    connection.on('close', function() {
        // close user connection
        removeConnection(connection);
        
        //Debug print
        /*console.log("These are the screens connected");
		for(i = 0; i < screens.length; i++) {
			console.log(screens[i].name + " " + screens[i].id);
		}
		console.log("");*/
		});
});

