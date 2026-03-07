<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 

$sql = "CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    parent_id INT NOT NULL, 
    student_id INT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'warning',
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";

if ($mysqli->query($sql)) {
    echo "Table 'notifications' created successfully.\n";
} else {
    echo "Error creating table: " . $mysqli->error . "\n";
}

$mysqli->close();
