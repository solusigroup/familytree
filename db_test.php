<?php
$attempts = [
    ['host' => '127.0.0.1', 'port' => 3306, 'user' => 'root', 'pass' => ''],
    ['host' => '127.0.0.1', 'port' => 3306, 'user' => 'root', 'pass' => 'root'],
    ['host' => 'localhost', 'port' => 3306, 'user' => 'root', 'pass' => ''],
    ['host' => '127.0.0.1', 'port' => 3306, 'user' => 'test', 'pass' => 'test'],
];

foreach ($attempts as $db) {
    try {
        $dsn = "mysql:host={$db['host']};port={$db['port']}";
        $pdo = new PDO($dsn, $db['user'], $db['pass']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "SUCCESS: host={$db['host']} user={$db['user']} pass={$db['pass']}\n";
        
        // Try creating database
        $pdo->exec("CREATE DATABASE IF NOT EXISTS family_tree_bani_ali_dahlan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        echo "Database created successfully!\n";
        exit(0);
    } catch (PDOException $e) {
        echo "FAILED: host={$db['host']} user={$db['user']} pass={$db['pass']} -> " . $e->getMessage() . "\n";
    }
}
echo "\nALL CONNECTIONS FAILED.\n";
