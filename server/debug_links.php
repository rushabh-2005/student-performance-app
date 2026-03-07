<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 

$res = $mysqli->query("SELECT p.id as parent_id, p.student_id, u.id as user_id, u.name as student_name 
                       FROM parents p 
                       LEFT JOIN users u ON p.student_id = u.id");

echo "PARENTS LINKED TO STUDENTS:\n";
while($row = $res->fetch_assoc()) {
    echo "Parent ID: {$row['parent_id']} | Linked Std ID: {$row['student_id']} | Found User: " . ($row['user_id'] ? "YES ({$row['student_name']})" : "NO") . "\n";
}

$res2 = $mysqli->query("SELECT id, name FROM users");
echo "\nALL STUDENTS:\n";
while($row = $res2->fetch_assoc()) {
    echo "ID: {$row['id']} | Name: {$row['name']}\n";
}

$mysqli->close();
