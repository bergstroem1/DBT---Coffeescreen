﻿<?php
	$background = "#00AEEF";
	
	$class = ".menubar{
	background:$background;
	width:100%;
	height:40px;
	border-radius:15px;
	-webkit-border-radius:15px;
	-moz-border-radius:15px;
	position:absolute;
	top:0;
	left:0;
}

.menuitem{
	background:white;
	width:150px;
	height:25px;
	border-radius:10px;
	-webkit-border-radius:10px;
	-moz-border-radius:10px;
	position:relative;
	float:left;
	margin:5px 0 0 20px;
	padding:5px 0 0 0;
	text-align:center;
	font-family:'Calibri', Calibri, sans-serif;
	font-weight:bold;
}

.background{
	width:1000px;
	height:700px;
	position:relative;
	top:2px;
	margin-left:auto;
	margin-right:auto;
}

.content{
	width:996px;
	height:646px;
	border-radius:15px;
	-webkit-border-radius:15px;
	-moz-border-radius:15px;
	border:2px solid $background;
	position:absolute;
	top:50px;
	padding:10px 0 0 0;
	overflow-y:auto;
}

.contentheader{
	background:$background;
	color:white;
	height:32px;
	position:relative;
	left:0;
	padding:8px 0 0 10px;
	margin:5px 0 0 0;
	font-family:'Calibri', Calibri, sans-serif;
	font-weight:bold;
	font-size:20px;
}

.screenAllPanicButton{
	background:red;
	width:100px;
	height:30px;
	border-radius:10px;
	-webkit-border-radius:10px;
	-moz-border-radius:10px;
	position:absolute;
	top:0;
	left:875px;
	text-align:center;
	border:0px;
	padding:0;
	margin: 5px 0 0 0;
	font-family:'Calibri', Calibri, sans-serif;
	font-weight:bold;
	font-size:15px;
}";
	
	$fh = fopen("./css/dyncss.css", "w");
	fwrite($fh, $class);

	fclose($fh);
/*

.menubar{
	background:#00AEEF;
	width:100%;
	height:40px;
	border-radius:15px;
	-webkit-border-radius:15px;
	-moz-border-radius:15px;
	position:absolute;
	top:0;
	left:0;
}

.menuitem{
	background:white;
	width:150px;
	height:25px;
	border-radius:10px;
	-webkit-border-radius:10px;
	-moz-border-radius:10px;
	position:relative;
	float:left;
	margin:5px 0 0 20px;
	padding:5px 0 0 0;
	text-align:center;
	font-family:"Calibri", Calibri, sans-serif;
	font-weight:bold;
}

.background{
	width:1000px;
	height:700px;
	position:relative;
	top:2px;
	margin-left:auto;
	margin-right:auto;
}

.content{
	width:996px;
	height:646px;
	border-radius:15px;
	-webkit-border-radius:15px;
	-moz-border-radius:15px;
	border:2px solid #00AEEF;
	position:absolute;
	top:50px;
	padding:10px 0 0 0;
	overflow-y:auto;
}

.contentheader{
	background:#00AEEF;
	color:white;
	height:32px;
	position:relative;
	left:0;
	padding:8px 0 0 10px;
	margin:5px 0 0 0;
	font-family:"Calibri", Calibri, sans-serif;
	font-weight:bold;
	font-size:20px;
}

.screenAllPanicButton{
	background:red;
	width:100px;
	height:30px;
	border-radius:10px;
	-webkit-border-radius:10px;
	-moz-border-radius:10px;
	position:absolute;
	top:0;
	left:875px;
	text-align:center;
	border:0px;
	padding:0;
	margin: 5px 0 0 0;
	font-family:"Calibri", Calibri, sans-serif;
	font-weight:bold;
	font-size:15px;
}

*/
?>