<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 

$sql = "CREATE TABLE IF NOT EXISTS parents (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    student_id INT NOT NULL, 
    parent_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL, 
    contact_no VARCHAR(50), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";

if ($mysqli->query($sql)) {
    echo "Table 'parents' created successfully.\n";
} else {
    echo "Error creating table: " . $mysqli->error . "\n";
}

$mysqli->close();
