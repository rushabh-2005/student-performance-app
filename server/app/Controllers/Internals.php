<?php

namespace App\Controllers;

use App\Models\InternalModel;
use CodeIgniter\API\ResponseTrait;

class Internals extends BaseController
{
    use ResponseTrait;

    // POST: /auth/internals/publish
    public function create()
    {
        $model = new InternalModel();
        $json = $this->request->getJSON();

        if (!$json) {
            return $this->fail("No data provided");
        }

        // Logic to prevent duplicate internal entries for the same semester
        $existing = $model->where([
            'user_id' => $json->user_id,
            'semester' => $json->semester
        ])->first();

        if ($existing) {
            return $this->failResourceExists('Internal marks for this semester are already published.');
        }

        // Data preparation
        $data = [
            'user_id'        => $json->user_id,
            'semester'       => $json->semester,
            'subject_1'      => $json->subject_1,
            'subject_2'      => $json->subject_2,
            'subject_3'      => $json->subject_3,
            'subject_4'      => $json->subject_4,
            'subject_5'      => $json->subject_5,
            'extra_curricular' => $json->extra_curricular,
            'total_internal' => $json->total_internal
        ];

        if ($model->insert($data)) {
            return $this->respondCreated(['message' => 'Internal marks published successfully!']);
        }

        return $this->fail('Database error: Unable to publish marks.');
    }

    // GET: /auth/internals/user/(:num)
    public function getByUser($userId)
    {
        $model = new InternalModel();
        $data = $model->where('user_id', $userId)->findAll();
        
        if (!$data) {
            return $this->respond([]); // Return empty array if no results found
        }

        return $this->respond($data);
    }
}