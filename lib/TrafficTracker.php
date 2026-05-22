<?php
// /lib/TrafficTracker.php
// Literally just to track the following
// - Date of visit
// - Human type traffic making some minor assumptions
// - Browser language
// - Page visited
// - Referring page
// - Browser vendor (Google, Apple, Mozilla, et c)
// - Browser platform (Linux, Windows, et c)
// All data stored is anonymous. All potentially identifying data is thrown out once the relevant data is recorded.
header('X-Robots-Tag: noindex, nofollow, nosnippet');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents('php://input'),true);
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$is_bot = preg_match('/bot|crawl|spider|curl|wget|python/i', $user_agent);
$maybe_bot = $data['screen'];
if (is_string($maybe_bot)) {
    $maybe_bot = explode('x',$maybe_bot);
    $width = trim($maybe_bot[0] ?? '0');
    $height = trim($maybe_bot[1] ?? '0');
    if (count($maybe_bot)<2) $maybe_bot = true;
    else if (!is_numeric($width) || !is_numeric($height)) $maybe_bot = true;
    else if (intval($width)<10 || intval($height)<10) $maybe_bot = true;
    else $maybe_bot = false;
}
else $maybe_bot = true;

unset($data['screen']);

$row = [
    date('Y-m-d H:i:s'),
    $is_bot ? 'bot' : ( $maybe_bot ? 'maybe' : 'human' ),
    $data['browser']['language'] ?? '',
    $data['page'] ?? $_SERVER['HTTP_REFERER'] ?? '/',
    $data['referrer'] ?? '',
    $data['browser']['vendor'] ?? '',
    $data['browser']['platform'] ?? '',
];

if (!file_exists('../data/visits.csv')) $file = fopen('../data/visits.csv', 'w');
else $file = fopen('../data/visits.csv', 'a');
fputcsv($file,$row);
fclose($file);
header('Content-Type: application/json');
echo json_encode(['status' => 'ok']);

?>