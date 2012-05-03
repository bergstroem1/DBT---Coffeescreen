﻿/*
 * saveFeed()
 * Used for saving a feed, will use the information in the form.
*/
function saveFeed(){
	var name = document.getElementById("name").value;
	var type = document.getElementById("typeSelect").value;
	
	var table = document.getElementById("required");
	var poststr = "&custom=";
	for(var i = table.getElementsByTagName("tr").length-1; i >= 4; i--){
		poststr += table.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].childNodes[0].name + "|";
		//console.log(table.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].childNodes[0].name);
		poststr += table.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].childNodes[0].value + ",";
		//console.log(table.getElementsByTagName("tr")[i].getElementsByTagName("td")[1].childNodes[0].value);
	}
	poststr = poststr.substr(0, poststr.length-2);
	
	if(name == ""){
		alert("Please enter the required fields");
	}
	else{
		var type = document.getElementById("typeSelect").value;
		var note = document.getElementById("note").value;
		var priority = document.getElementById("priority").value;
		var displaytime = document.getElementById("displayTime").value;
		var expiretime = document.getElementById("expireTime").value;
		
		var url = document.URL;
		url = url.substr(url.indexOf("?")+1);
		var p = url.substr(0,3);
		var oname = url.substr(9);
		if(p == "p=2"){
			if(!(oname.substr(0,oname.indexOf(".")) == name))
				$.ajax({
					type: "POST",
					url: "feedhandler.php",
					data: "p=3&name="+oname,
					success: function(msg){
					}
				});
		}
		
		if(oname.substr(0,oname.length-5) != name){
			$.ajax({
				type: "POST",
				url: "feedhandler.php",
				data: "p=list",
				success: function(msg){
					var jsonobj = jQuery.parseJSON(msg);
					for(var i = 0; i < jsonobj.length; i++){
						var jsonitem = jQuery.parseJSON(jsonobj[i]);
						if(jsonitem["name"] == name){
							var conflict = true;
							if(confirm('This will replace an existing feed. Continue?'))
								$.ajax({
									type: "POST",
									url: "feedhandler.php",
									data: "p=1&name="+name+"&type="+type+poststr+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
									success: function(msg){
										window.location = "adminfeed.php";
									}
								});
						}
					}
					if(!conflict)
						$.ajax({
							type: "POST",
							url: "feedhandler.php",
							data: "p=1&name="+name+"&type="+type+poststr+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
							success: function(msg){
								window.location = "adminfeed.php";
							}
						});
					}
			});
		}
		else{
			$.ajax({
				type: "POST",
				url: "feedhandler.php",
				data: "p=1&name="+name+"&type="+type+poststr+"&note="+note+"&priority="+priority+"&displaytime="+displaytime+"&expiretime="+expiretime,
				success: function(msg){
					window.location = "adminfeed.php";
				}
			});
		}
	}
}

function editFeed(name){
	getFeedTypes();
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=2&name="+name,
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			document.getElementById("name").value = jsonobj["name"];
			document.getElementById("typeSelect").value = jsonobj["type"];
			document.getElementById("note").value = jsonobj["note"];
			document.getElementById("priority").value = jsonobj["priority"];
			document.getElementById("displayTime").value = jsonobj["displaytime"];
			document.getElementById("expireTime").value = jsonobj["expiretime"];
		}
	});
}

function getFeedTypes(){
	var select = document.getElementById("typeSelect");
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=type",
		success: function(msg){
			var arr = msg.substr(2, msg.length-4).split('\",\"');
			for(var i = 0; i < arr.length; i++){
				var temp = document.createElement("option");
				temp.value = arr[i];
				temp.appendChild(document.createTextNode(arr[i]));
				select.appendChild(temp);
			}
		}
	});
}

function listFeeds(){
	var table = document.getElementById("listContent");
	
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=list",
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			console.log(msg);
			for(var i = 0; i < jsonobj.length; i++){
				var jsonitem = jQuery.parseJSON(jsonobj[i]);
				
				var tr = document.createElement("tr");
				tr.id = jsonitem["name"];
				tr.className = (table.getElementsByTagName("tr").length % 2 == 0) ? "listItem" : "listItem grey";
				
				var td = document.createElement("td");
				td.className = "itemName";
				td.appendChild(document.createTextNode(jsonitem["name"]));
				tr.appendChild(td);
				
				td = document.createElement("td");
				td.className = "itemType";
				td.appendChild(document.createTextNode(jsonitem["type"]));
				tr.appendChild(td);
				
				td = document.createElement("td");
				td.className = "itemDescription";
				var note = (jsonitem["note"].length > 200) ? jsonitem["note"].substr(0,200) + "...": jsonitem["note"];
				td.appendChild(document.createTextNode(note));
				tr.appendChild(td);
				
				td = document.createElement("td");
				button = document.createElement("input");
				button.type = "button";
				button.id = jsonitem["name"] + ".json";
				button.value = "Delete";
				button.className = "itemButton red";
				td.appendChild(button);
				
				button = document.createElement("input");
				button.type = "button";
				button.id = jsonitem["name"] + ".json";
				button.value = "Edit";
				button.className = "itemButton maincolor";
				td.appendChild(button);
				
				tr.appendChild(td);
				
				table.appendChild(tr);
			}
		}
	});
}

/*
 * Handle clicks in adminfeed.php
*/
$(document).ready(function(){
	$('.content').click(function(e){
		if($(e.target).is('.itemButton')){
			if(e.target.value == "Add")
				window.location = "feed.php?p=1";
			else if(e.target.value == "Edit")
				window.location = "feed.php?p=2&name="+e.target.id;
			else
				deleteFeed(e.target.id);
		}
	});
	
	$('#typeSelect').change(function(e){
		getTypeParameters();
	});
});

/*
 * deleteFeed(name)
 * Will delete the feed with the given name.
 * name: Name of the feed that is going to be deleted.
*/
function deleteFeed(name){
	var divname = name.substr(0, name.length-5);
	var parentname = document.getElementById(name).parentNode.parentNode.parentNode.getAttribute("id");
	$.ajax({
		type: "POST",
		url: "feedhandler.php",
		data: "p=3&name="+name,
		success: function(msg){
			document.getElementById(parentname).removeChild(document.getElementById(divname));
		}
	});
}

/**
 * Parametertypes:
 * ShortText = 0; (input text)
 * LongText = 1; (text area)
 * Number = 2; (input number)
 * Boolean = 3; (input checkbox)
 */
function getTypeParameters(){
	var table = document.getElementById("required");
	var select = document.getElementById("typeSelect").value;
	
	if(table.getElementsByTagName("tr").length > 4){
		for(var i = table.getElementsByTagName("tr").length-1; i >= 4; i--){
			table.removeChild(table.getElementsByTagName("tr")[i]);
		}
	}
	
	$.ajax({
		type: "GET",
		url: "../../services/Api.php",
		data: "getParameters&service="+select,
		success: function(msg){
			var jsonobj = jQuery.parseJSON(msg);
			for(row in jsonobj){
				item = jsonobj[row];
				var tr = document.createElement("tr");
				tr.className = "listItem";
				
				var td = document.createElement("td");
				td.appendChild(document.createTextNode(item["label"]));
				tr.appendChild(td);
				
				var td = document.createElement("td");
				var type = parseInt(item["type"]);
				var input = null;
				switch(type)
				{
					case 0:
					//ShortText = 0; (input text)
						input = document.createElement("input");
						input.name = row;
						input.className = "formTXB";
						input.value = item["value"];
						break;
					case 1:
					//LongText = 1; (text area)
						input = document.createElement("textarea");
						input.name = row;
						input.className = "noteTXB";
						input.appendChild(document.createTextNode(item["value"]));
						break;
					case 2:
					//Number = 2; (input number)
						input = document.createElement("input");
						input.name = row;
						input.type = "number";
						input.className = "formNB";
						input.value = item["value"];
						break;
					case 3:
					//Boolean = 3; (input checkbox)
						input = document.createElement("input");
						input.name = row;
						input.type = "checkbox";
						input.value = item["value"];
						break;
					default:
					  break;
				}
				td.appendChild(input);
				tr.appendChild(td);
				
				table.appendChild(tr);
			}
		}
	});
}