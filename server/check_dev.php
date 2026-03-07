<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 

$res = $mysqli->query("SELECT id, name, current_sem FROM users WHERE name='dev'");
while($row = $res->fetch_assoc()) {
    print_r($row);
}

$mysqli->close();
