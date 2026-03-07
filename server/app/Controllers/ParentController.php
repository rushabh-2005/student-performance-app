<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\AttendanceModel;
use App\Models\InternalModel;
use App\Models\MonitoringModel;
use CodeIgniter\API\ResponseTrait;

class ParentController extends BaseController
{
    use ResponseTrait;
    
    public function getStudentByEmail()
    {
        $email = trim($this->request->getVar('email') ?? '');
        if (!$email) {
            return $this->fail('Email parameter is required.');
        }

        $userModel = new UserModel();
        $student = $userModel->where('email', $email)->first();
        
        if (!$student) {
            return $this->failNotFound('Student not found.');
        }

        return $this->respond([
            'id' => $student['id'],
            'name' => $student['name'],
            'contact_no' => $student['contact_no'],
            'alt_contact_no' => $student['alt_contact_no']
        ]);
    }

    public function getStudentSnapshot($studentId)
    {
        $userModel = new UserModel();
        $attModel = new AttendanceModel();
        $intModel = new InternalModel();
        $monModel = new MonitoringModel();

        // 1. Get the Student's Basic Info
        $student = $userModel->find($studentId);
        if (!$student) {
            return $this->failNotFound('Student record not found.');
        }

        // 2. Aggregate Attendance %
        $attendance = $attModel->where('user_id', $studentId)->findAll();
        $totalAttended = array_sum(array_column($attendance, 'attended_lectures'));
        $totalPossible = array_sum(array_column($attendance, 'total_lectures'));
        $attPer = ($totalPossible > 0) ? ($totalAttended / $totalPossible) * 100 : 0;

        // 3. Get Latest Internal Marks
        $internals = $intModel->where('user_id', $studentId)
                             ->orderBy('created_at', 'DESC')
                             ->first();

        // 4. Get Average Daily Study Hours from logs
        $studyLogs = $monModel->where('user_id', $studentId)->findAll();
        $avgStudy = count($studyLogs) > 0 ? array_sum(array_column($studyLogs, 'study_hours')) / count($studyLogs) : 0;

        // 5. Combine into a "Snapshot" for the Parent Dashboard
        $report = [
            'name'            => $student['name'],
            'current_sem'     => $student['current_sem'],
            'attendance_per'  => round($attPer, 2),
            'internal_total'  => $internals ? $internals['total_internal'] : 0,
            'avg_study_hours' => round($avgStudy, 2),
            'risk_status'     => ($attPer < 75) ? 'High Risk (Low Attendance)' : 'Normal'
        ];

        return $this->respond($report);
    }

    public function register()
    {
        $db = \Config\Database::connect();
        $json = $this->request->getJSON();

        // 1. Find the student by email
        $userModel = new \App\Models\UserModel();
        $studentEmail = trim($json->student_email ?? '');
        $student = $userModel->where('email', $studentEmail)->first();

        if (!$student) {
            return $this->failNotFound('No student found with that email address.');
        }

        // 2. Check if this parent email is already registered
        $builder = $db->table('parents');
        $existing = $builder->where('email', $json->email)->get()->getRow();
        if ($existing) {
            return $this->failResourceExists('This email is already registered as a parent.');
        }

        // 3. Create the Parent Record
        $data = [
            'student_id'  => $student['id'], // Link found from 'users' table
            'parent_name' => $json->parent_name,
            'email'       => $json->email,
            'password'    => $json->password, // Store as plain text
            'contact_no'  => $json->contact_no
        ];

        if ($builder->insert($data)) {
            return $this->respondCreated(['message' => 'Parent account created successfully']);
        }

        return $this->fail('Failed to create account.');
    }

    public function login()
    {
        $db = \Config\Database::connect();
        $json = $this->request->getJSON();

        // 1. Target the 'parents' table specifically
        $builder = $db->table('parents');
        $parent = $builder->where('email', $json->email)->get()->getRowArray();

        // 2. Verify existence and plain-text password
        if ($parent && $parent['password'] === $json->password) {
            
            // 3. (Optional) Get basic student info to show on parent dashboard header
            $userModel = new \App\Models\UserModel();
            $student = $userModel->find($parent['student_id']);

            return $this->respond([
                'id' => $parent['id'],
                'name' => $parent['parent_name'],
                'role' => 'parent',
                'student_id' => $parent['student_id'], // THIS IS THE KEY
                'student_name' => $student['name'],
                'token' => '...' // Your JWT or Session token
            ]);
        }

        return $this->failUnauthorized('Invalid email or password');
    }
}