<?php
	header("cache-control:no-store");
	$str = file_get_contents("data.json");
	echo $str;
?>