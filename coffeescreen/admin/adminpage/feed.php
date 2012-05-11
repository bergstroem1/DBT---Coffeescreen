﻿<!DOCTYPE html>

<html>
	<head>
		<title>Feeds</title>
		<link rel="stylesheet" type="text/css" href="css/admin.css"/>
		<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="js/feed.js"></script>
		<script type="text/javascript" src="js/jquery.watermark.js"></script>
		<meta charset="UTF-8"/>
	</head>
	<body>
		<div id="background" class="background">
			<?php include("navigation.html") ?>
			<div id="feedcontent" class="content">
				<?php
					include("feedform.html");
					if($_GET['p'] == 2){
						$name = $_GET['name'];
						echo "<script>getFeedTypes(\"$name\")</script>";
					}
					else{
						echo "<script>getFeedTypes();</script>";
					}
				?>
			</div>
		</div>
	</body>
</html>