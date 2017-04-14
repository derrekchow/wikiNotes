<?php
	$text = $_POST['text'];
	$file = fopen($_POST['fileName'], "w");
	if ($file == false) {
		echo("error opening file");
		exit();
	}
	fwrite($file, $text);
	fclose($file);
?>