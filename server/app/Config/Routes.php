<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// User Authentication routes
$routes->post('/auth/register', 'Auth::register');
$routes->post('/auth/login', 'Auth::login');
$routes->put('/auth/update-profile/(:num)', 'Auth::updateProfile/$1');

//Admin Authentication routes
$routes->post('/auth/admin/login', 'Auth::adminLogin');

//Admin CRUD routes
$routes->get('/students', 'Results::getStudents');
$routes->get('/results', 'Results::index');
$routes->post('/results', 'Results::create');
$routes->delete('/results/(:num)', 'Results::delete/$1');
$routes->post('/subjects/add', 'SubjectController::addSubject');
$routes->get('/subjects/list/(:any)', 'SubjectController::getBySemester/$1');
$routes->delete('/subjects/delete/(:num)', 'SubjectController::delete/$1');
// Route to get a specific student's results
$routes->get('/results/user/(:num)', 'Results::getUserResults/$1');

// Attendance routes
$routes->get('/attendance/user/(:num)', 'Attendance::getUserAttendance/$1');
$routes->post('/attendance/update', 'Attendance::update');

// Internal Marks Management
$routes->post('/internals/publish', 'Internals::create');
$routes->get('/internals/user/(:num)', 'Internals::getByUser/$1');

// Monitoring Route
$routes->post('/monitoring/add', 'Monitoring::add');
$routes->put('/monitoring/update/(:num)', 'Monitoring::update/$1');
$routes->delete('/monitoring/delete/(:num)', 'Monitoring::delete/$1');
$routes->get('/monitoring/user/(:num)', 'Monitoring::getLogsByUser/$1');
$routes->get('/admin/overview/(:any)', 'MonitoringController::getStudentOverview/$1');
$routes->get('/analytics/user/(:num)', 'AnalyticsController::getUserAnalytics/$1');

// Parent Routes
$routes->group('parent', static function ($routes) {
    $routes->post('register', 'ParentController::register');
    $routes->post('login', 'ParentController::login');
    $routes->get('student-snapshot/(:num)', 'ParentController::getStudentSnapshot/$1');
    $routes->get('get-student-by-email', 'ParentController::getStudentByEmail');
});

// Notification Routes
$routes->post('/admin/notify-parent', 'NotificationController::notify');
$routes->get('/notifications/parent/(:num)', 'NotificationController::getNotifications/$1');
$routes->post('/notifications/mark-read/(:num)', 'NotificationController::markAsRead/$1');

$routes->get('/test-db-5', function() {
    $db = \Config\Database::connect();
    $q = $db->query("SELECT id, name, current_sem FROM users")->getResultArray();
    return json_encode(['data' => $q]);
});