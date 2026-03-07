<?php
namespace App\Controllers;
use App\Models\SubjectModel;
use CodeIgniter\API\ResponseTrait;

class SubjectController extends BaseController
{
    use ResponseTrait;

    public function getBySemester($semester)
    {
        $model = new SubjectModel();
        // Returns only subjects for the requested semester
        $semester = urldecode($semester);
        $data = $model->where('semester', $semester)->findAll();
        return $this->respond($data);
    }
    public function addSubject() {
    $model = new SubjectModel();
    
    // Validate that we don't exceed 5 subjects for this semester
    $existingCount = $model->where('semester', $this->request->getVar('semester'))->countAllResults();
    
    if ($existingCount >= 5) {
        return $this->fail('This semester already has the maximum of 5 subjects.');
    }

    $data = [
        'semester'     => $this->request->getVar('semester'),
        'subject_name' => $this->request->getVar('subject_name'),
        'subject_code' => $this->request->getVar('subject_code'),
        'slot_number'  => $this->request->getVar('slot_number'), // Received from React
    ];

    if ($model->insert($data)) {
        return $this->respondCreated(['message' => 'Subject added successfully']);
    }
    return $this->fail('Failed to add subject');
}

    public function delete($id = null)
    {
        $model = new SubjectModel();
        if ($model->delete($id)) {
            return $this->respondDeleted(['id' => $id, 'message' => 'Subject deleted successfully']);
        }
        return $this->failNotFound('Subject not found or failed to delete');
    }
}