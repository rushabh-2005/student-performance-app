<?php

namespace App\Controllers;

use App\Models\ResultModel;
use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;

class Results extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $resultModel = new ResultModel();
        $data = $resultModel->select('results.*, users.name')
            ->join('users', 'users.id = results.user_id')
            ->findAll();
        return $this->respond($data);
    }

    public function getStudents()
    {
        $userModel = new UserModel();
        return $this->respond($userModel->findAll());
    }
    public function create()
    {
        $resultModel = new ResultModel();
        $data = $this->request->getJSON(true);
        $data['total_marks'] = $data['subject_1'] + $data['subject_2'] + $data['subject_3'] + $data['subject_4'] + $data['subject_5'];
        if ($resultModel->insert($data)) {
            return $this->respondCreated(['message' => 'Result uploaded successfully ! ']);
        }
        return $this->fail('Failed to save result');
    }
    public function delete($id = null)
    {
        $resultModel = new ResultModel();
        if ($resultModel->delete($id)) {
            return $this->respondDeleted(['message' => 'Result Deleted Successfully']);
        }
        return $this->fail('Failed to delete result');
    }

    // Fetch results for a specific user
    public function getUserResults($userId = null)
    {
        $resultModel = new ResultModel();

        // Find all results where user_id matches the logged-in student
        $results = $resultModel->where('user_id', $userId)->findAll();

        return $this->respond($results);
    }
}
