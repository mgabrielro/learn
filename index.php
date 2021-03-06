<!DOCTYPE html>
<html>
<head>
    <title>Learn Project</title>
    <link href="public/assets/desktop/dist/css/main.css" rel="stylesheet">

</head>
<body>

    <div class="header_grade">Learn Project</div>

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

    <script src="public/assets/desktop/dist/js/libs.js"></script>
    <script src="public/assets/desktop/dist/js/app.js"></script>

</body>
</html>
