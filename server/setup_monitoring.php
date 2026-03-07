<?php
$mysqli = new mysqli('127.0.0.1', 'root', '', 'student_analysis'); 
$sql = "CREATE TABLE IF NOT EXISTS monitoring_logs (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT, 
    subject_id INT,
    semester VARCHAR(50), 
    study_hours DECIMAL(5,2), 
    log_date DATE, 
    extra_tutoring INT
);";
if ($mysqli->query($sql)) {
    echo "Table 'monitoring_logs' created successfully.";
} else {
    echo "Error creating table: " . $mysqli->error;
}
$mysqli->close();
