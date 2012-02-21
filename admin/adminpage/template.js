/* 
 * createItem(name, target)
 * Function used for creating a new drag-/droppable div inside a target div.
 * name: Will be the id of the div
 * target: The target div to place the new div inside
*/
function createItem(name, target){
	var divTag = document.createElement("div");
	divTag.id = "" + name;
	divTag.setAttribute("draggable","true");
	divTag.addEventListener('dragstart', handleDragStart, false);
	divTag.addEventListener('dragend', handleDragEnd, false);
	divTag.className ="contentitem";
	divTag.innerHTML = name;
	
	var delbutton = document.createElement("input");
	delbutton.setAttribute("type","button");
	delbutton.setAttribute("name","rbutton");
	delbutton.setAttribute("value","X");
	delbutton.setAttribute("class","removebutton");
	delbutton.setAttribute("onclick","removeItem(this)");
	divTag.appendChild(delbutton);
	
	document.getElementById(target).appendChild(divTag);
}

/*
 * createCont(form)
 * Wrapper function for createItem, will create items and put them in the contentlist.
 * form: The submitted form containing the input text.
*/
function createCont(form){
	if(form.sourcename.value == ""){
		alert("Please enter a sourcename");
	}
	else{
		var name = form.sourcename.value;
		createItem(name, "contentlist");
		form.sourcename.value = "";
	}
}

/*
 * fillcontent(csv, target)
 * Wrapper function for createItem, will create the given items from the csv 
 * string and put them in the target div.
 * csv: Comma-separated value containing the RSS sources.
 * target: The id off the target div.
*/
function fillcontent(csv, target){
	if(csv.length > 0){
		var items = csv.split(',');
		
		for(var i = 0; i < items.length; i++){
			createItem(items[i],target)
		}
	}
}

/*
 * removeItem(element)
 * Used for removing a source item.
 * element: The element that will be removed.
*/
function removeItem(element){
	var name = element.parentNode.getAttribute("id");
	var parentname = element.parentNode.parentNode.getAttribute("id");
	document.getElementById(parentname).removeChild(document.getElementById(name));
}

/*
 * saveTemplate(form)
 * Used for saving a template, will use the information in the form.
*/
function saveTemplate(form){
	if(form.name.value == ""){
		alert("Please enter a name");
	}
	else{
		var fname = form.name.value;	
		var fnote = form.note.value;

		var children = document.getElementById('maincontent').childNodes;
		var length = children.length;
		var mainContent = "";
		
		for(var n = 0; n < length; n++){
			mainContent += children[n].getAttribute('id')  + ",";
		}
		mainContent = mainContent.substr(0,mainContent.length-1);
		
		children = document.getElementById('subcontent').childNodes;
		var length = children.length;
		var subContent = "";
		
		for(var n = 0; n < length; n++){
			subContent += children[n].getAttribute('id') + ",";
		}
		
		subContent = subContent.substr(0,subContent.length-1);
		
		$.ajax({
			type: "POST",
			url: "templatehandler.php",
			data: "p=1&name="+fname+"&note="+fnote+"&maincontent="+mainContent+"&subcontent="+subContent,
			success: function(msg){
				console.log("Succesful template save");
				window.location = "admintemplate.php";
			}
		});
	}
}

/*
 * editTemplate(name)
 * 
*/
function editTemplate(name){
	$.ajax({
		type: "POST",
		url: "templatehandler.php",
		data: "p=2&name="+name,
		success: function(msg){
			console.log("Succesful template load");
			var jsonobj = JSON.parse(msg);
			console.log(jsonobj);
			document.getElementById("nameTXB").setAttribute("value",jsonobj["name"]);
			document.getElementById("noteTXB").innerHTML = jsonobj["note"];
			fillcontent(jsonobj["maincontent"], "maincontent");
			fillcontent(jsonobj["subcontent"], "subcontent");
			
			$.ajax({
				type: "POST",
				url: "templatehandler.php",
				data: "p=3&name="+name,
				success: function(msg){
				}
			});
		}
	});
}

/*
 *
*/
function deleteTemplate(name){
	var divname = name.substr(0, name.length-5);
	var parentname = document.getElementById(name).parentNode.parentNode.getAttribute("id");
	$.ajax({
		type: "POST",
		url: "templatehandler.php",
		data: "p=3&name="+name,
		success: function(msg){
			document.getElementById(parentname).removeChild(document.getElementById(divname));
			console.log("Succesful template delete");
		}
	});
}

/*
 *
*/
$(document).ready(function(){
	$('.TInew').click(function(e){
		window.location = "template.php?p=1";
	});
	
	$('.content').click(function(e){
		if($(e.target).is('.TIedit')){
			window.location = "template.php?p=2&name="+e.target.id;
		}
		if($(e.target).is('.TIdelete')){
			deleteTemplate(e.target.id);
		}
	});
});


function addEL(){
	document.getElementById("maincontent").addEventListener('dragenter', handleDragEnter, false);
	document.getElementById("maincontent").addEventListener('dragleave', handleDragLeave, false);
	document.getElementById("maincontent").addEventListener('drop', handleDrop, false);
	document.getElementById("maincontent").addEventListener('dragover', handleDragOver, false);
	
	document.getElementById("subcontent").addEventListener('dragenter', handleDragEnter, false);
	document.getElementById("subcontent").addEventListener('dragleave', handleDragLeave, false);
	document.getElementById("subcontent").addEventListener('drop', handleDrop, false);
	document.getElementById("subcontent").addEventListener('dragover', handleDragOver, false);
	
	document.getElementById("contentlist").addEventListener('dragenter', handleDragEnter, false);
	document.getElementById("contentlist").addEventListener('dragleave', handleDragLeave, false);
	document.getElementById("contentlist").addEventListener('drop', handleDrop, false);
	document.getElementById("contentlist").addEventListener('dragover', handleDragOver, false);
}
/*
 *
*/
function createContTEST()
{
	for(var i = 0; i < 35; i++)
	{
		createItem(i, "contentlist");
	}
}

function listTemplates(){
	var tempList = document.getElementById("content");
	var tempHead = document.createElement("div");
	tempHead.id = "templatehead";
	tempHead.className = "templateheader";
	tempHead.innerHTML = "Name:";
	tempList.appendChild(tempHead);
	var newButton = document.createElement("input");
	newButton.type = "button";
	newButton.id = "newbutton";
	newButton.value = "New template";
	newButton.className = "TInew";
	tempHead.appendChild(newButton);
	
	
	$.ajax({
		type: "POST",
		url: "tempget.php",
		data: "",
		success: function(msg){
			var arr = msg.substr(2, msg.length-4).split('\",\"');
			for(var i = 0; i < arr.length; i++){
				var item = document.createElement("div");
				item.id = arr[i];
				item.className = "templateitem";
				item.innerHTML = arr[i];
				
				var editButton = document.createElement("input");
				editButton.type = "button";
				editButton.id = arr[i] + ".json";
				editButton.value = "Edit";
				editButton.className = "TIedit";
				item.appendChild(editButton);
				
				var delButton = document.createElement("input");
				delButton.type = "button";
				delButton.id = arr[i] + ".json";
				delButton.value = "Delete";
				delButton.className = "TIdelete";
				item.appendChild(delButton);
				
				tempList.appendChild(item);
			}
		}
	});
}

function listScreens(){
	var screenHeader = document.createElement("div");
	screenHeader.id = "screenheader";
	screenHeader.className = "templateheader";
	screenHeader.innerHTML = "Name:";
	document.getElementById("content").appendChild(screenHeader);
	for(var i = 0; i < 5; i++){
		createScreen(i);
	}
}

function createScreen(name){
	var screenItem = document.createElement("div");
	screenItem.id = "" + name;
	screenItem.className = "templateitem";
	screenItem.innerHTML = name;
	
	var panicButton = document.createElement("input");
	panicButton.type = "button";
	panicButton.value = "Panic";
	
	var select = document.createElement("select");
	$.ajax({
		type: "POST",
		url: "tempget.php",
		data: "",
		success: function(msg){
			var arr = msg.substr(2, msg.length-4).split('\",\"');
			for(var i = 0; i < arr.length; i++){
				var temp = document.createElement("option");
				temp.value = arr[i];
				temp.innerHTML = arr[i];
				select.appendChild(temp);
			}
		}
	});
	
	var set = document.createElement("input");
	set.type = "button";
	set.value = "set";
	screenItem.appendChild(panicButton);
	screenItem.appendChild(select);
	screenItem.appendChild(set);
	document.getElementById("content").appendChild(screenItem);
}