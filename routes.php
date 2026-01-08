<?php
require_once 'lib/QuickieValidator.php';
require_once 'lib/CodeToolValidator.php';

$routes = [
    '/' => 'pages/HomePage.php',
    '/writing/samples' => 'pages/SamplesPage.php',
    '/writing/quickies' => 'pages/QuickiesPage.php',
    '/writing/quickies/{id}' => 'pages/Quickie.php',
    '/code' => 'pages/ToolsPage.php',
    '/code/{slug}' => 'pages/Tool.php',
    '/art' => 'pages/ArtPage.php',
    '/publications' => 'pages/PublicationsPage.php',
    '/about' => 'pages/AboutPage.php',
    '/contact' => 'pages/ContactPage.php',
    '/links' => 'pages/LinksPage.php',
    '/downloads' => 'pages/DownloadsPage.php',
    '/sitemap.xml'=> 'sitemap.php'
];
function getPageForPath($path): array {
    global $routes;
    $cleanPath = rtrim($path, '/');
    if ($cleanPath === '') $cleanPath = '/';
    
    // Check exact matches first
    if (isset($routes[$cleanPath])) {
        return ['page'=>$routes[$cleanPath]];
    }
    
    // Handle dynamic routes like /writing/quickies/{id}
    if (strpos($cleanPath, '/writing/quickies/') === 0) {
        $parts = explode('/', $cleanPath);
        if (count($parts) >= 4) {
            $id = $parts[3];
            if ($id !== '' && $id !== '404') {
                // Validate against database
                $validator = new QuickieValidator();
                if ($validator->isValid($id)) {
                    return [
                        'page' => 'pages/Quickie.php', 
                        'id' => $id,
                        'quickie_data' => $validator->getItem($id)
                    ];
                }
            }
        }
        return ['page'=>'pages/404.php'];
    }
    if (strpos($cleanPath, '/code/') === 0) {
        $parts = explode('/', $cleanPath);
        if (count($parts) >= 3) {
            $id = $parts[2];
            if ($id !== '' && $id !== '404') {
                // Validate against database
                $validator = new CodeToolValidator();
                if ($validator->isValid($id)) {
                    return [
                        'page' => 'pages/Tool.php', 
                        'id' => $id,
                        'tool_data' => $validator->getItem($id)
                    ];
                }
            }
        }
        return ['page'=>'pages/404.php'];
    }
    return ['page'=>'pages/404.php'];
}
?>