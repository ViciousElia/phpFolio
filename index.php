<?php
require_once 'components/ui/Header.php';
require_once 'components/ui/Footer.php';
require_once 'routes.php';

$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$routeData = getPageForPath($currentPath);
$page = $routeData['page'];

$pageId = $routeData['id'] ?? null;

// Include the page - the page will have access to $pageId if needed
include $page;
if ($page=='sitemap.php') return;
?>


<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/styles/global.css">
    <link rel="stylesheet" href="/styles/collections.css">
    <?=$headData ?? ''?>
    <link rel="icon" type="image/x-icon" href="/public/favicon.svg">
    <link rel="stylesheet" href="/styles/ko-fi.css">
</head>
<body>
<?= Components\Header::render(['currentPath'=>$currentPath]);?>
<main>
    <?=$bodyData ?? ''?>
</main>
<?= Components\Footer::render();?>
</body>
</html>