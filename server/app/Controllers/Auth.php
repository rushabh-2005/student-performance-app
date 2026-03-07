<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;

class Auth extends BaseController
{
    use ResponseTrait;

    public function register()
    {
        // 1. Validation Rules
        $rules = [
            'name' => 'required|min_length[3]|alpha_space', // <-- alpha_space blocks numbers/special chars
            'email' => 'required|valid_email|is_unique[users.email]',
            'contact_number' => 'required|min_length[10]', // Enforce basic phone length
            'alt_contact_number' => 'required|min_length[10]', // Make alternate required
            'current_year' => 'required',
            'current_sem' => 'required',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validateData((array) $this->request->getVar(), $rules)) {
            return $this->fail($this->validator->getErrors());
        }

        // 2. Save User
        $userModel = new UserModel();
        $data = [
            'name' => $this->request->getVar('name'),
            'email' => $this->request->getVar('email'),
            'contact_no' => $this->request->getVar('contact_number'),
            'alt_contact_no' => $this->request->getVar('alt_contact_number'),
            'current_year' => $this->request->getVar('current_year'),
            'current_sem' => $this->request->getVar('current_sem'),
            'password' => $this->request->getVar('password'),
        ];

        $userModel->save($data);

        return $this->respondCreated(['message' => 'User registered successfully']);
    }
    public function login()
    {
        // 1. Validation Rules
        $rules = [
            'email' => 'required|valid_email',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validateData((array) $this->request->getVar(), $rules)) {
            return $this->fail($this->validator->getErrors());
        }

        // 2. Get Data
        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        // 3. Find User
        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        // 4. Verify User & Password (Plain Text Check)
        if (!$user || $user['password'] !== $password) {
            return $this->failUnauthorized('Invalid Email or Password');
        }

        // 5. Success - Return User Data (excluding password)
        unset($user['password']); // Don't send password back

        return $this->respond([
            'message' => 'Login Successful',
            'user' => $user
        ]);
    }
    // ... inside Auth class ...

    public function adminLogin()
    {
        // 1. Validation
        $rules = [
            'email' => 'required|valid_email',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validateData((array) $this->request->getVar(), $rules)) {
            return $this->fail($this->validator->getErrors());
        }

        // 2. Get Input
        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        // 3. Find Admin in 'admins' table
        // Note: We use AdminModel here, not UserModel
        $adminModel = new \App\Models\AdminModel();
        $admin = $adminModel->where('email', $email)->first();

        // 4. Verify Admin Credentials (Plain Text)
        if (!$admin || $admin['password'] !== $password) {
            return $this->failUnauthorized('Invalid Admin Credentials');
        }

        unset($admin['password']); // Hide password

        return $this->respond([
            'message' => 'Admin Login Successful',
            'user' => $admin // We send this as 'user' to keep frontend logic similar
        ]);
    }

    public function updateProfile($id)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $rules = [
            'name' => 'required|min_length[3]|alpha_space',
            'email' => "required|valid_email|is_unique[users.email,id,$id]",
            'contact_no' => 'required|min_length[10]',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validateData((array) $this->request->getVar(), $rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $data = [
            'name' => $this->request->getVar('name'),
            'email' => $this->request->getVar('email'),
            'contact_no' => $this->request->getVar('contact_no'),
            'password' => $this->request->getVar('password'),
        ];

        if ($userModel->update($id, $data)) {
            $updatedUser = $userModel->find($id);
            unset($updatedUser['password']);
            return $this->respond([
                'message' => 'Profile updated successfully',
                'user' => $updatedUser
            ]);
        }

        return $this->fail('Failed to update profile');
    }
}
