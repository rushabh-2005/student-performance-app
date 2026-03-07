<?php
namespace App\Controllers;

use CodeIgniter\Controller;

class Predictor extends Controller
{
    public function analyze() {
    $json = $this->request->getJSON();

    $att = $json->attendance_per;
    $study = $json->study_hours;
    $internal = $json->internal_marks;
    $tutoring = $json->tutoring;

    // A basic predictive formula:
    // 50% weight to internals, 20% to attendance, 30% to study habits
    $score = ($internal / 30 * 35) + ($att / 100 * 15) + ($study / 10 * 15) + ($tutoring * 5);
    $final_score = round(min($score, 70));

    $response = [
        'predicted_score' => $final_score,
        'status' => ($final_score >= 28) ? "You are on track to pass!" : "You are currently at risk of failing.",
        'advice' => ($final_score < 28) ? "Recommendation: Increase study hours to at least 4 hours daily." : "Keep up the good work!"
    ];

    return $this->respond($response);
    }
}
