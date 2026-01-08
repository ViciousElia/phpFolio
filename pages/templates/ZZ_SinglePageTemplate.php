<?php
$headData = "";
$bodyData = "";


// ============================================
// CUSTOMIZATION POINT: HEAD CONTENT
// ============================================

ob_start();
?>
<title>Page Title | Site Name</title>
<meta name="description" content="Meta Description" />
<link rel="stylesheet" href="/styles/stylesheet.css">
<?php
$headData = ob_get_clean();


// ============================================
// CUSTOMIZATION POINT: BODY CONTENT
// ============================================

ob_start();
?>
<div class="content-frame">
    
<!-- Add the actual page content here. This can be replaced with MD and a Parsedown include+render if needed. -->

</div>
<?php
$bodyData = ob_get_clean();
?>