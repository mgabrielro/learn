<link rel="stylesheet/less" type="text/css" href="/public/assets/less/main.less" />


<h1><?= 'Learn Project'; ?></h1>

<?php
$domain = 'learn-project.com';

$db = [
    'database' => [
        'host'     => 'localhost',
        'username' => 'root',
        'password' => 'asdf12',
        'database' => 'core'
    ]
];

$pdo_core = new PDO('mysql:dbname=' . $db['database']['database'] . ';host=' . $db['database']['host'], $db['database']['username'], $db['database']['password']);
$pdo_core->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $pdo_core->prepare('SHOW CREATE TABLE status');
$stmt->execute();

$statusDefinition = $stmt->fetch();

echo '<pre>'; print_r($statusDefinition);

?>