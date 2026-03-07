<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 
$sql = "CREATE TABLE IF NOT EXISTS internal_results (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT, 
    semester VARCHAR(50), 
    subject_1 INT, 
    subject_2 INT, 
    subject_3 INT, 
    subject_4 INT, 
    subject_5 INT, 
    extra_curricular INT, 
    total_internal INT
);";
$mysqli->query($sql);

$sql2 = "ALTER TABLE internal_results ADD COLUMN extra_curricular INT;";
$mysqli->query($sql2); // this will throw a harmless error if the column already exists

echo "Done";
