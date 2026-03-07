<?php
namespace App\Controllers;
use App\Models\UserModel;
use App\Models\AttendanceModel;
use App\Models\InternalModel;
use App\Models\MonitoringModel;
use CodeIgniter\API\ResponseTrait;

class MonitoringController extends BaseController {
    use ResponseTrait;

    public function getStudentOverview($semester) {
        $userModel = new UserModel();
        $attModel = new AttendanceModel();
        $intModel = new InternalModel();
        $monModel = new MonitoringModel();

        // Get all students in the selected semester
        $students = $userModel->where('current_sem', $semester)->findAll();
        $report = [];

        foreach ($students as $s) {
            // Aggregate Attendance %
            $attendance = $attModel->where('user_id', $s['id'])->findAll();
            $totalAttended = array_sum(array_column($attendance, 'attended_lectures'));
            $totalPossible = array_sum(array_column($attendance, 'total_lectures'));
            $attPer = ($totalPossible > 0) ? ($totalAttended / $totalPossible) * 100 : 0;

            // Get Internal Marks
            $internals = $intModel->where(['user_id' => $s['id'], 'semester' => $semester])->first();

            // Get Average Daily Study Hours
            $studyLogs = $monModel->where('user_id', $s['id'])->findAll();
            $avgStudy = count($studyLogs) > 0 ? array_sum(array_column($studyLogs, 'study_hours')) / count($studyLogs) : 0;

            $report[] = [
                'id' => $s['id'],
                'name' => $s['name'],
                'attendance_per' => round($attPer, 2),
                'internal_total' => $internals ? $internals['total_internal'] : 0,
                'avg_study_hours' => round($avgStudy, 2),
                'risk_level' => ($attPer < 75 || ($internals && $internals['total_internal'] < 50)) ? 'High' : 'Normal'
            ];
        }

        return $this->respond($report);
    }
}