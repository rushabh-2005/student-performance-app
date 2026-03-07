<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'email', 'contact_no', 'alt_contact_no', 'current_year', 'current_sem', 'password'];
    protected $useTimestamps = true;
}