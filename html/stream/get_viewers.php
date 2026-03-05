<?php
$file = __DIR__ . "/viewers.json";
$viewers = file_exists($file)
    ? json_decode(file_get_contents($file), true)
    : [];

echo count($viewers);
