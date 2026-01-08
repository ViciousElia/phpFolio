<?php
$headData = "";
$bodyData = "";

if (isset($pageId)) {
    require_once 'lib/Parsedown.php';
    require_once 'lib/Spyc.php';
    $Parsedown = new Parsedown();

    if (file_exists($routeData['quickie_data']['file_path'])) {
        try{
        $content = file_get_contents($routeData['quickie_data']['file_path']);
        $offsetYAML = strpos($content,"\n---\n",3);
        $yaml = substr($content,4,$offsetYAML-4);
        $content = substr($content,$offsetYAML+5);
        $pageInfo = Spyc::YAMLLoadString($yaml);

        ob_start();?>
        <div class="content-frame">
            <div>
                <div class="crumbs"><a href="/writing/quickies">Quickies</a> &gt; <?=$pageInfo['date']?></div>
                <?=$Parsedown->text($content)?>
            </div>
            <div class="last-content">
                <hr />
                <p>Tags:<span> --- </span>
                    <?php foreach ($pageInfo['tags'] as $tag):
                        $escapedTag = htmlspecialchars($tag, ENT_QUOTES, 'UTF-8');
                    ?>
                        <a href="/writing/quickies?tag=<?= urlencode($tag) ?>"><?= $escapedTag ?></a><span> --- </span>
                    <?php endforeach; ?>
                </p>
                <p>Words: <?=$pageInfo['words']?></p>
                <p>Date: <?=$pageInfo['date']?></p>
            </div>
        </div>
        <?php $bodyData = ob_get_clean();

        ob_start();?>
            <title><?=$pageInfo['title']?> | Fruit Folio</title>
            <meta name="description" content="<?=$pageInfo['description']?>" />
            <meta property="og:title" content="<?=$pageInfo['title']?> | Fruit Folio" />
            <meta property="og:description" content="<?=$pageInfo['summary']?>" />
            <meta property="og:url" content="https://fruitfolio.com/writing/quickies/<?=$pageInfo['date']?>" />
            <meta property="og:image" content="/general/img/<?=(array_key_exists('img',$pageInfo)?$pageInfo['img']:'logoOG.png')?>" />
            <link rel="canonical" href="https://fruitfolio.com/writing/quickies/<?=$pageInfo['date']?>" />
            <script type="application/ld+json">
{
    "@context" : "https://schema.org",
    "@type" : "ShortStory",
    "author" : {
        "@type": "Person",
        "name": "Terra Hyde"
    },
    "datePublished" : "<?=$pageInfo['date']?>",
    "description" : "<?=$pageInfo['description']?>",
    "name" : "<?=$pageInfo['title']?>"
}
            </script>
        <?php $headData = ob_get_clean();
        } catch (Exception $e) {
            // Just in case
            error_log("Quickie error: " . $e->getMessage());
            include 'pages/500.php';
        }
    } else {
        // Shouldn't, but fallback for safety
        include 'pages/404.php';
    }
} else {
    // Shouldn't, but fallback for safety
    include 'pages/404.php';
}
?>
