<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 

$res = $mysqli->query("SELECT * FROM parents");
echo "ALL PARENTS RAW DATA:\n";
while($row = $res->fetch_assoc()) {
    print_r($row);
}

$mysqli->close();
