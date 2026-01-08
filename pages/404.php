<?php
$headData = "";
$bodyData = "";

// Build the head data
ob_start();
?>
<title>404 - Page Not Found | Fruit Folio</title>
<meta name="description" content="The page you're looking for doesn't exist. Check the URL or navigate back to the homepage." />
<link rel="stylesheet" href="/styles/errors.css">
<?php
$headData = ob_get_clean();

// Build the body data
ob_start();
?>
<div class="content-frame error-page">
    <h1>404</h1>
    <p>The page you're looking for doesn't exist. It might have been moved, deleted, or you might have typed the URL incorrectly.</p>
    
    <div class="error-links">
        <a href="/">← Back to Home</a>
    </div>
</div>
<?php
$bodyData = ob_get_clean();
?>