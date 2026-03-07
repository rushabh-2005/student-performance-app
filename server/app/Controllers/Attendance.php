<?php

namespace App\Controllers;

use App\Models\AttendanceModel;
use CodeIgniter\API\ResponseTrait;

class Attendance extends BaseController
{
    use ResponseTrait;

    // Fetch all subject-wise logs for a specific student
    public function getUserAttendance($userId)
    {
        $model = new AttendanceModel();
        $data = $model->where('user_id', $userId)->findAll();
        return $this->respond($data);
    }

    // The "Upsert" logic: Save or Update attendance
    public function update()
    {
        $model = new AttendanceModel();
        $json = $this->request->getJSON();

        // Check if a log already exists for this specific User + Subject + Semester
        $existing = $model->where([
            'user_id'    => $json->user_id,
            'subject_id' => $json->subject_id,
            'semester'   => $json->semester
        ])->first();

        $data = [
            'user_id'           => $json->user_id,
            'subject_id'        => $json->subject_id,
            'semester'          => $json->semester,
            'attended_lectures' => $json->attended_lectures,
            'total_lectures'    => $json->total_lectures
        ];

        if ($existing) {
            return $this->failResourceExists('Attendance for this subject has already been set and cannot be changed.');
        } else {
            // Insert new record
            $model->insert($data);
            return $this->respondCreated(['message' => 'Attendance initialized successfully']);
        }
    }
}