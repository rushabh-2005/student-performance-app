<?php

namespace App\Models;

use CodeIgniter\Model;

class InternalModel extends Model
{
    protected $table            = 'internal_results';
    protected $primaryKey       = 'id';
    protected $allowedFields    = [
        'user_id', 
        'semester', 
        'subject_1', 
        'subject_2', 
        'subject_3', 
        'subject_4', 
        'subject_5', 
        'extra_curricular',
        'total_internal'
    ];
    protected $useTimestamps    = false; // We use MySQL default for created_at
}