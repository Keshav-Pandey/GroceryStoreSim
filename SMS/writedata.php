<?php
	extract($_POST);
	$handle = fopen("data1.json","w");
	$arr = array(
		'servers' => $servers,
		'customers' => $customers,
		'trial' => $trial,
		'payment' => $payment
	);
	fwrite($handle,json_encode($arr));
	fclose($handle);
	echo "done";
?>