<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 
$data = [];

$res = $mysqli->query("SELECT * FROM parents");
while($row = $res->fetch_assoc()) { $data['parents'][] = $row; }

$res = $mysqli->query("SELECT id, name, email FROM users");
while($row = $res->fetch_assoc()) { $data['users'][] = $row; }

file_put_contents('db_dump.json', json_encode($data, JSON_PRETTY_PRINT));
echo "Dumped to db_dump.json\n";
$mysqli->close();
