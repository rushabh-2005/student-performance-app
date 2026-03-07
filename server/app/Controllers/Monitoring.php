<?php

namespace App\Controllers;

use App\Models\MonitoringModel;
use CodeIgniter\API\ResponseTrait;

class Monitoring extends BaseController
{
    use ResponseTrait;

    public function add()
    {
        $model = new MonitoringModel();
        $json = $this->request->getJSON();

        if (!$json) {
            return $this->fail("No data provided");
        }

        // Prevent duplicate entries for the same subject per user
        $existing = $model->where('user_id', $json->user_id)
                          ->where('subject_id', $json->subject_id)
                          ->first();
                          
        if ($existing) {
            return $this->fail('Study log for this subject already exists. Please update the existing log instead.');
        }

        $data = [
            'user_id'        => $json->user_id,
            'subject_id'     => $json->subject_id,
            'semester'       => $json->semester,
            'study_hours'    => $json->hours,
            'extra_tutoring' => $json->tutoring
        ];

        if ($model->insert($data)) {
            return $this->respondCreated(['message' => 'Study log added successfully!']);
        }

        return $this->fail('Failed to add study log.');
    }

    public function getLogsByUser($userId)
    {
        $db = \Config\Database::connect();
        $query = $db->query("SELECT m.*, s.subject_name FROM monitoring_logs m LEFT JOIN subjects s ON m.subject_id = s.id WHERE m.user_id = ? ORDER BY m.id DESC LIMIT 30", [$userId])->getResultArray();
        return $this->respond($query);
    }

    public function update($id = null)
    {
        $model = new MonitoringModel();
        $json = $this->request->getJSON();

        if (!$json || !$id) {
            return $this->fail("No data provided or invalid ID");
        }

        // Get the log to ensure we have the correct user_id if not provided in JSON
        $existingLog = $model->find($id);
        if (!$existingLog) {
            return $this->failNotFound('Study log not found.');
        }

        $userId = $json->user_id ?? $existingLog['user_id'];

        // Prevent updating to a subject that already has another log for this user
        $duplicate = $model->where('user_id', $userId)
                           ->where('subject_id', $json->subject_id)
                           ->where('id !=', $id)
                           ->first();
                           
        if ($duplicate) {
            return $this->fail('Study log for this subject already exists.');
        }

        $data = [
            'subject_id'     => $json->subject_id,
            'study_hours'    => $json->hours,
            'extra_tutoring' => $json->tutoring
        ];

        if ($model->update($id, $data)) {
            return $this->respond(['message' => 'Study log updated successfully!']);
        }

        return $this->fail('Failed to update study log.');
    }

    public function delete($id = null)
    {
        $model = new MonitoringModel();
        
        if ($model->delete($id)) {
            return $this->respondDeleted(['message' => 'Study log deleted successfully!']);
        }

        return $this->fail('Failed to delete study log.');
    }
}
