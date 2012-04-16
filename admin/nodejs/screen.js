
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
