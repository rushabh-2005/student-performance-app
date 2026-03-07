<?php

namespace App\Models;
use CodeIgniter\Model;

class ResultModel extends Model
{
    protected $table = 'results';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'user_id',
        'semester',
        'subject_1',
        'subject_2',
        'subject_3',
        'subject_4',
        'subject_5',
        'extra_curricular',
        'total_marks'
    ];
}