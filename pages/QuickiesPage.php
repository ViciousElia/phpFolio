<?php
$headData = "";
$bodyData = "";
require_once 'lib/Spyc.php';

$pageTitle = 'Quickies';
$pageDescription = 'Effectively a blog, but more accurately a repository of short stories by Terra Hyde. Some true, some fiction, some poetic.';

// Get filter and pagination from query string
$tagFilter = $_GET['tag'] ?? null;
$page = isset($_GET['page']) ? max(0, (int)$_GET['page']) : 0;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$allowedLimits = [10, 25, 50, 100];
if (!in_array($limit, $allowedLimits)) {
    $limit = 10;
}

// Initialize QuickieValidator to get all quickies
require_once 'lib/QuickieValidator.php';
$validator = new QuickieValidator();
$quickies = $validator->getAllItems();

// Sort by date (newest first)
usort($quickies, function($a, $b) {
    $dateA = $a['file_path'];
    $dateB = $b['file_path'];
    return strcmp($dateB, $dateA); // Newest first
});

// Apply tag filter if present
if ($tagFilter) {
    $preFilter = array_filter($quickies, function($quickie) use ($tagFilter) {
        return in_array($tagFilter, $quickie['tags'] ?? []);
    });
    $quickies = array_values($preFilter);
} else {
    $preFilter = $quickies;
}

// Get unique tags for tag cloud
$tagList = [];
foreach ($quickies as $quickie) {
    if (!isset($quickie['draft']) || $quickie['draft'] != true) {
        foreach ($quickie['tags'] ?? [] as $tag) {
            if (!in_array($tag, $tagList)) {
                $tagList[] = $tag;
            }
        }
    }
}
sort($tagList);

// Paginate results
$totalItems = count($preFilter);
$totalPages = ceil($totalItems / $limit);
$page = min($page, max(0, $totalPages - 1));
$offset = $page * $limit;
$paginated = array_slice($preFilter, $offset, $limit);

// Get newest quickie for featured section
$newestQuickie = !empty($quickies) ? reset($quickies) : null;

// Build the featured content
$featuredContent = '';
if ($newestQuickie && file_exists($newestQuickie['file_path']) && !($tagFilter || $page>0)) {
    try {
        require_once 'lib/Parsedown.php';
        $Parsedown = new Parsedown();
        
        $content = file_get_contents($newestQuickie['file_path']);
        $offsetYAML = strpos($content, "\n---\n", 3);
        if ($offsetYAML !== false) {
            $content = substr($content, $offsetYAML + 5);
            $featuredContent = $Parsedown->text($content);
        }
    } catch (Exception $e) {
        $featuredContent = '<p>Error loading featured quickie.</p>';
        error_log("Featured quickie error: " . $e->getMessage());
    }
}

// Build the head data
ob_start();
?>
<title><?=$pageTitle?> | Fruit Folio</title>
<meta name="description" content="<?= htmlspecialchars($pageDescription) ?>" />
<meta property="og:title" content="<?=$pageTitle?> | Fruit Folio" />
<meta property="og:description" content="<?= htmlspecialchars($pageDescription) ?>" />
<meta property="og:url" content="https://fruitfolio.com/writing/quickies" />
<meta property="og:image" content="/general/img/logoOG.png" />
<link rel="canonical" href="https://fruitfolio.com/writing/quickies" />
<link rel="stylesheet" href="/styles/pagination.css" />
<?php
$headData = ob_get_clean();

// Build the body data
ob_start();
?>
<div class="content-frame">
    <h2>Quickies</h2>
    <p>
        Short pieces written at the whims of life. Not the worst writing in the world, but probably not the best. For now, you can click into any of the stories you see except the one in the box ... I'll be fixing that later, but it's a lot of work. Feel free to scroll to the bottom and use the tags to filter down what you're seeing. Hope you enjoy.
    </p>
    
    <?php if ($featuredContent): ?>
    <div class="featured">
        <?= $featuredContent ?>
    </div>
    <?php endif; ?>
    <div class="last-content">
        <div class="pagination">
            <?php if ($limit < $totalItems): ?>
            <div class="page-selection">
                <?php if ($page > 0): ?>
                    <?php 
                    $prevUrl = "/writing/quickies?" . http_build_query([
                        'tag' => $tagFilter,
                        'page' => $page - 1,
                        'limit' => $limit
                    ]);
                    ?>
                    <a href="<?= $prevUrl ?>" class="button" aria-label="Previous page">← Previous</a>
                <?php endif; ?>
                
                <span>Page <?= $page + 1 ?></span>
                
                <?php if (($page + 1) * $limit < $totalItems): ?>
                    <?php 
                    $nextUrl = "/writing/quickies?" . http_build_query([
                        'tag' => $tagFilter,
                        'page' => $page + 1,
                        'limit' => $limit
                    ]);
                    ?>
                    <a href="<?= $nextUrl ?>" class="button" aria-label="Next page">Next →</a>
                <?php endif; ?>
            </div>
            <?php endif; ?>
            
            <div class="per-page">
                <span>Per Page:</span>
                <?php foreach ($allowedLimits as $limitOption): ?>
                    <?php if ($limit === $limitOption): ?>
                        <span><?= $limitOption ?></span>
                    <?php else: ?>
                        <?php 
                        $limitUrl = "/writing/quickies?" . http_build_query([
                            'tag' => $tagFilter,
                            'page' => 0, // Reset to first page
                            'limit' => $limitOption
                        ]);
                        ?>
                        <a href="<?= $limitUrl ?>" class="button"><?= $limitOption ?></a>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
            
            <hr />
            
            <?php if (!empty($paginated)): ?>
            <ul class="flex-table">
                <?php foreach ($paginated as $summary): ?>
                    <li>
                        <h3>
                            <a href="/writing/quickies/<?= htmlspecialchars($summary['id'] ?? '') ?>">
                                <?= htmlspecialchars($summary['title'] ?? 'Untitled') ?>
                            </a>
                        </h3>
                        <hr />
                        <p><?= htmlspecialchars($summary['summary'] ?? '') ?></p>
                    </li>
                <?php endforeach; ?>
            </ul>
            <?php else: ?>
                <p>No quickies found<?= $tagFilter ? ' with tag "' . htmlspecialchars($tagFilter) . '"' : '' ?>.</p>
                <?php if ($tagFilter): ?>
                    <p><a href="/writing/quickies">View all quickies</a></p>
                <?php endif; ?>
            <?php endif; ?>
        </div>
        
        <div class="tag-selection">
            <hr />
            <h2>Tags</h2>
            <ul class="flex-list">
                <?php foreach ($tagList as $tag): ?>
                    <li>
                        <?php if ($tag === $tagFilter): ?>
                            <a href="/writing/quickies" class="clickable" role="button"><?= htmlspecialchars($tag) ?></a>
                        <?php else: ?>
                            <?php 
                            $tagUrl = "/writing/quickies?" . http_build_query([
                                'tag' => $tag,
                                'page' => 0, // Reset to first page
                                'limit' => $limit
                            ]);
                            ?>
                            <a href="<?= $tagUrl ?>" class="button"><?= htmlspecialchars($tag) ?></a>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>    
</div>
<?php
$bodyData = ob_get_clean();
?>
