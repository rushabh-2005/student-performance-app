<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 

$res = $mysqli->query("SELECT id, name, email FROM users WHERE id IN (9, 11)");
echo "RELEVANT STUDENTS:\n";
while($row = $res->fetch_assoc()) {
    echo "ID: {$row['id']} | Name: {$row['name']} | Email: {$row['email']}\n";
}

$res2 = $mysqli->query("SELECT p.parent_name, p.student_id, p.email FROM parents p");
echo "\nALL REGISTERED PARENTS:\n";
while($row = $res2->fetch_assoc()) {
    echo "Parent: {$row['parent_name']} | Linked Student ID: {$row['student_id']} | Email: {$row['email']}\n";
}

$mysqli->close();
