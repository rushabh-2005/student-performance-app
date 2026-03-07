<?php
$mysqli = new mysqli("localhost", "root", "", "student_analysis");
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
$result = $mysqli->query("SELECT * FROM attendance_logs");
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        print_r($row);
    }
} else {
    echo "0 results in attendance_logs";
}
$mysqli->close();
?>
