<?php

namespace App\Controllers;

use App\Models\ResultModel;
use App\Models\InternalModel;
use App\Models\AttendanceModel;
use App\Models\MonitoringModel;
use App\Models\SubjectModel;
use CodeIgniter\API\ResponseTrait;

class AnalyticsController extends BaseController
{
    use ResponseTrait;

    public function getUserAnalytics($userId)
    {
        $resultModel = new ResultModel();
        $internalModel = new InternalModel();
        $attendanceModel = new AttendanceModel();
        $monitoringModel = new MonitoringModel();
        $subjectModel = new SubjectModel();

        // 1. External Results (Latest Semester)
        $external = $resultModel->where('user_id', $userId)->orderBy('created_at', 'DESC')->first();
        
        // 2. Internal Results (Latest Semester)
        $internal = $internalModel->where('user_id', $userId)->orderBy('id', 'DESC')->first();

        // 3. Attendance Summary
        $attendance = $attendanceModel->where('user_id', $userId)->findAll();
        $totalAttended = array_sum(array_column($attendance, 'attended_lectures'));
        $totalPossible = array_sum(array_column($attendance, 'total_lectures'));
        $attendancePer = ($totalPossible > 0) ? ($totalAttended / $totalPossible) * 100 : 0;

        // 4. Study Hours Analysis (By Subject)
        $studyLogs = $monitoringModel->where('user_id', $userId)->findAll();
        
        // Group study hours by subject
        $studyBySubject = [];
        $subjectMap = [];
        
        // Determine the semester to analyze
        $semester = $external ? $external['semester'] : ($internal ? $internal['semester'] : 'Sem 1');

        $allSubjectsForSem = $subjectModel->where('semester', $semester)->findAll();
        foreach($allSubjectsForSem as $s) {
            $subjectMap[$s['id']] = $s['subject_name'];
            $studyBySubject[$s['subject_name']] = 0;
        }

        foreach ($studyLogs as $log) {
            if (isset($subjectMap[$log['subject_id']])) {
                $subName = $subjectMap[$log['subject_id']];
                $studyBySubject[$subName] += (float)$log['study_hours'];
            }
        }

        $studyAnalysisData = [];
        foreach ($studyBySubject as $name => $hours) {
            if ($hours > 0) {
                $studyAnalysisData[] = ['name' => $name, 'value' => $hours];
            }
        }

        $avgStudyHours = count($studyBySubject) > 0 ? array_sum(array_values($studyBySubject)) / count($studyBySubject) : 0;
        $totalStudyHours = array_sum(array_values($studyBySubject));

        // 5. Subject-wise Analysis (Internal vs External)
        $subjects = $subjectModel->where('semester', $semester)->orderBy('slot_number', 'ASC')->findAll();
        
        $subjectAnalysis = [];
        foreach ($subjects as $sub) {
            $slot = 'subject_' . $sub['slot_number'];
            $subjectAnalysis[] = [
                'subject' => $sub['subject_name'],
                'internal' => $internal ? (int)$internal[$slot] : 0,
                'external' => $external ? (int)$external[$slot] : 0,
            ];
        }

        $data = [
            'summary' => [
                'avg_internal' => $internal ? round($internal['total_internal'] / 5, 2) : 0, 
                'avg_external' => $external ? round($external['total_marks'] / 5, 2) : 0,
                'attendance_per' => round($attendancePer, 2),
                'avg_study_hours' => round($avgStudyHours, 2),
                'total_study_hours' => $totalStudyHours,
                'total_internal' => $internal ? $internal['total_internal'] : 0,
                'total_external' => $external ? $external['total_marks'] : 0,
            ],
            'subject_analysis' => $subjectAnalysis,
            'attendance_stats' => [
                'present' => $totalAttended,
                'absent' => $totalPossible - $totalAttended,
                'total' => $totalPossible
            ],
            'study_analysis' => $studyAnalysisData,
            'publishing_status' => [
                'internal_published' => $internal ? true : false,
                'external_published' => $external ? true : false,
                'user_data_entered' => count($studyLogs) > 0 ? true : false
            ],
            'can_download' => ($internal && $external && count($studyLogs) > 0)
        ];

        return $this->respond($data);
    }
}
