<?php
$headData = "";
$bodyData = "";


// ============================================
// CUSTOMIZATION POINT: HEAD CONTENT
// ============================================

ob_start();
?>
<title>Vicious Elia&#39;s Link Page</title>
<meta name="description" content="A collection of links to various bits of content." />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/x-icon" href="/general/img/newFavicon.svg">
<style type="text/css">
    .linkgroup{width:100%;text-align:center}
    .linkgroup h3{width:100%;height:2em;align-content:center;margin: 0 auto}
    .linkgroup p{width:100%;height:1.5em;align-content:center;padding:0.75em;margin: 0 auto}
</style>
<?php
$headData = ob_get_clean();


// ============================================
// CUSTOMIZATION POINT: BODY CONTENT
// ============================================

ob_start();
?>
<div class="content-frame">
    <div class="header">
        <h2>Vicious Elia&#39;s Various Links</h2>
    </div>

    <div class="main">
        <div class="linkgroup">
            <h3>Books</h3>
            <p><a href="https://a.co/d/7Tvp4os">Song of Returning [amazon link]</a></p>
            <p><a href="https://a.co/d/guoRDcJ">Dewey Decimal Dating [amazon link]</a></p>
            <p><a href="https://a.co/d/29VBgXP">Rambling to an Empty Room [amazon link]</a></p>
            <p><a href="https://a.co/d/gFoLTkE">Assorted (miss)Adventures [amazon link]</a></p>
            <p><a href="https://a.co/d/btZBbBr">Ember of Hope [amazon link]</a></p>
        </div>

        <div class="linkgroup">
            <h3>Other Stuff</h3>
            <p><a href="https://fruitfolio.com/">Home Page [fruit folio link]</a></p>
            <p><a href="https://rose.fruitfolio.com/">A Tale of Thorns [fruit folio link]</a></p>
            <p><a href="https://birbles.com/">Birbles Art [birbles link]</a></p>
        </div>
    </div>
</div>
<?php
$bodyData = ob_get_clean();
?>