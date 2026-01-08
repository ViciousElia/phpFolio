<?php
$headData = "";
$bodyData = "";

// Build the head data
ob_start();
?>
<title>500 - Server Error | Fruit Folio</title>
<meta name="description" content="Server-side rendering error. The issue has been logged for review." />
<link rel="stylesheet" href="/styles/errors.css">
<?php
$headData = ob_get_clean();

// Build the body data
ob_start();
?>
<div class="content-frame error-page">
    <h1>500</h1>
    <p>There was an error in the server-side rendering of this page. Sorry about that.</p>
    <p>I've logged the error and will look into it in my weekly error report.</p>
    <p>This is what I get for being my own webmaster/developer/designer/et c.</p>
    
    <div class="error-links">
        <a href="/">← Back to Home</a>
    </div>
</div>
<?php
$bodyData = ob_get_clean();
?>