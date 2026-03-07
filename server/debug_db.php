<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 

echo "--- DATA ---\n";
$data = [];

$usersRows = $mysqli->query("SELECT id, name, email FROM users");
$data['users'] = $usersRows->fetch_all(MYSQLI_ASSOC);

$parentsRows = $mysqli->query("SELECT id, student_id, parent_name, email FROM parents");
$data['parents'] = $parentsRows->fetch_all(MYSQLI_ASSOC);

echo json_encode($data, JSON_PRETTY_PRINT);
echo "\n--- END ---\n";

$mysqli->close();
