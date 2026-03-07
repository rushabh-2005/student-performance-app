<?php

namespace App\Models;

use CodeIgniter\Model;

class AttendanceModel extends Model
{
    protected $table      = 'attendance_logs';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'user_id', 
        'subject_id', 
        'semester', 
        'total_lectures', 
        'attended_lectures'
    ];
    protected $useTimestamps = false;
}