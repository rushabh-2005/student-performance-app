<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;

class NotificationController extends BaseController
{
    use ResponseTrait;

    public function notify()
    {
        $db = \Config\Database::connect();
        $json = $this->request->getJSON();

        if (!$json || !isset($json->student_id)) {
            return $this->fail("Student ID is required.");
        }

        $studentId = $json->student_id;
        $riskLevel = $json->risk_level ?? 'High';

        // LOGGING FOR DEBUG
        log_message('error', "NOTIFY ATTEMPT: student_id = $studentId");

        // 1. Find the parent linked to this student
        $parent = $db->query("SELECT * FROM parents WHERE student_id = ?", [$studentId])->getRowArray();

        if (!$parent) {
            $allParents = $db->query("SELECT student_id FROM parents")->getResultArray();
            $ids = array_column($allParents, 'student_id');
            $msg = "No registered parent found for student ID: " . var_export($studentId, true) . ". Types: " . gettype($studentId) . ". Registered Student IDs: " . implode(', ', $ids);
            return $this->failNotFound($msg);
        }

        $studentName = $json->student_name ?? 'your child';
        $message = "Take care of your child";

        // 2. Save notification to database
        $notifData = [
            'parent_id'  => $parent['id'],
            'student_id' => $studentId,
            'message'    => $message,
            'type'       => strtolower($riskLevel) === 'high' ? 'error' : 'warning',
            'is_read'    => 0
        ];

        $db->table('notifications')->insert($notifData);

        // 3. Send Email (Mocking for now as we don't have SMTP configured)
        // In a real scenario, you'd use $email = \Config\Services::email();
        $emailStatus = $this->sendMockEmail($parent['email'], "Urgent: Student Performance Update", $message);

        return $this->respondCreated([
            'message' => 'Parent notified successfully!',
            'email_sent_to' => $parent['email'],
            'email_status' => $emailStatus
        ]);
    }

    private function sendMockEmail($to, $subject, $message)
    {
        // Log the email or something similar
        $logMessage = "[" . date('Y-m-d H:i:s') . "] EMAIL TO: $to | SUBJECT: $subject | MESSAGE: $message\n";
        file_put_contents(WRITEPATH . 'logs/mock_emails.log', $logMessage, FILE_APPEND);
        return "Simulated Success";
    }

    public function getNotifications($parentId)
    {
        $db = \Config\Database::connect();
        $notifications = $db->table('notifications')
                            ->where('parent_id', $parentId)
                            ->where('is_read', 0)
                            ->orderBy('created_at', 'DESC')
                            ->get()
                            ->getResultArray();

        return $this->respond($notifications);
    }

    public function markAsRead($id)
    {
        $db = \Config\Database::connect();
        $db->table('notifications')->where('id', $id)->update(['is_read' => 1]);
        return $this->respond(['message' => 'Notification marked as read']);
    }
}
