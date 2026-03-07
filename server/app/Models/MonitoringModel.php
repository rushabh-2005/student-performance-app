<?php
namespace App\Models;
use CodeIgniter\Model;

class MonitoringModel extends Model {
    protected $table = 'monitoring_logs';
    protected $primaryKey = 'id';
    protected $allowedFields = ['user_id', 'subject_id', 'semester', 'study_hours', 'extra_tutoring'];
    protected $useTimestamps = false;
}