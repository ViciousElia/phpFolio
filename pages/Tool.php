<?php
$headData = "";
$bodyData = "";

if (isset($pageId)) {
    require_once 'lib/Parsedown.php';
    require_once 'lib/Spyc.php';
    $Parsedown = new Parsedown();

    if (file_exists($routeData['tool_data']['file_path'])) {
        try {
            $content = file_get_contents($routeData['tool_data']['file_path']);
            $offsetYAML = strpos($content, "\n---\n", 3);
            $yaml = substr($content, 4, $offsetYAML - 4);
            $content = substr($content, $offsetYAML + 5);
            $toolInfo = Spyc::YAMLLoadString($yaml);
            
            ob_start();
            ?>
            <div class="content-frame">
                <div class="tool-header">
                    <div class="crumbs"><a href="/code">Code Tools</a> &gt; <?=$toolInfo['name']?></div>
                    <?php if (!empty($toolInfo['all_in_one'])): ?>
                    <div class="tool-download-main">
                        <p>Like what you see? Want to see how it works?</p>
                        <a href="<?= htmlspecialchars($toolInfo['all_in_one']) ?>" class="btn">
                            📦 Download Complete Package
                        </a>
                    </div>
                    <?php endif; ?>
                </div>
                <div class="tool-content">
                    <?= $Parsedown->text($content) ?>
                </div>
            </div>
            <script>document.addEventListener("DOMContentLoaded",(event)=>{highlightSyntax();});</script>
            <?php
            $bodyData = ob_get_clean();

            // Head data with tool-specific SEO
            ob_start();
            ?>
            <title><?=$toolInfo['name']?> | Fruit Folio</title>
            <meta name="description" content="<?=$toolInfo['description']?>" />
            <meta property="og:title" content="<?=$toolInfo['name']?> | Fruit Folio" />
            <meta property="og:description" content="<?=$toolInfo['description']?>" />
            <meta property="og:url" content="https://fruitfolio.com/code/<?=$pageId?>" />
            <meta property="og:image" content="/general/img/logoOG.png" />
            <link rel="canonical" href="https://fruitfolio.com/code/<?=$pageId?>" />
            <link rel="stylesheet" href="/styles/tools.css">
            <?php foreach ($toolInfo['supporting_scripts'] as $script): ?>
                <script type="text/javascript" src="<?=$script?>"<?php if (strpos($script,"_late_load")) echo ' defer'?>></script>
            <?php endforeach; ?>
            <script type="text/javascript" src="/content/code/scripts/ZZ_Syntax.js"></script>
            <?php
            $headData = ob_get_clean();
            
        } catch (Exception $e) {
            error_log("Tool page error: " . $e->getMessage());
            include 'pages/500.php';
        }
    } else {
        include 'pages/404.php';
    }
} else {
    include 'pages/404.php';
}
?>