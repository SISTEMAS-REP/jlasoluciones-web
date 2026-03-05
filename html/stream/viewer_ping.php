<?php
$file = __DIR__ . "/viewers.json";
$timeout = 15; // segundos

$ip = $_SERVER['REMOTE_ADDR'];
$now = time();

$viewers = file_exists($file)
    ? json_decode(file_get_contents($file), true)
    : [];

$viewers[$ip] = $now;

// limpiar viewers caídos
foreach ($viewers as $ipKey => $lastSeen) {
    if ($now - $lastSeen > $timeout) {
        unset($viewers[$ipKey]);
    }
}

file_put_contents($file, json_encode($viewers));

echo count($viewers);
