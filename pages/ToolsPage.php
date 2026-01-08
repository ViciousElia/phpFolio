<?php
$headData = "";
$bodyData = "";
require_once 'lib/Spyc.php';

$pageTitle = 'Code Tools';
$pageDescription = 'Useful and useless code tools and utilities built by Terra Hyde. What do they do? A little bit of everything.';

// Get filter and pagination from query string
$page = isset($_GET['page']) ? max(0, (int)$_GET['page']) : 0;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$allowedLimits = [10, 25, 50, 100];
if (!in_array($limit, $allowedLimits)) {
    $limit = 10;
}

// Initialize CodeToolValidator to get all code tools
require_once 'lib/CodeToolValidator.php';
$validator = new CodeToolValidator();
$tools = $validator->getAllItems();

// Sort by date (newest first)
usort($tools, function($a, $b) {
    $dateA = $a['file_path'];
    $dateB = $b['file_path'];
    return strcmp($dateB, $dateA); // alphabetise ... sorta
});

// Paginate results
$totalItems = count($tools);
$totalPages = ceil($totalItems / $limit);
$page = min($page, max(0, $totalPages - 1));
$offset = $page * $limit;
$paginated = array_slice($tools, $offset, $limit);

// Get newest tool for featured section
$newestTool = !empty($tools) ? reset($tools) : null;

// Build the featured content
$featuredContent = '';

// Build the head data
ob_start();
?>
<title><?=$pageTitle?> | Fruit Folio</title>
<meta name="description" content="<?= htmlspecialchars($pageDescription) ?>" />
<meta property="og:title" content="<?=$pageTitle?> | Fruit Folio" />
<meta property="og:description" content="<?= htmlspecialchars($pageDescription) ?>" />
<meta property="og:url" content="https://fruitfolio.com/code" />
<meta property="og:image" content="/general/img/logoOG.png" />
<link rel="canonical" href="https://fruitfolio.com/code" />
<link rel="stylesheet" href="/styles/pagination.css" />
<link rel="stylesheet" href="/styles/code.css" />
<?php
$headData = ob_get_clean();

// Build the body data
ob_start();
?>
<div class="content-frame">
    <h2>Code Tools</h2>
    <p>
        A collection of handy utilities I've built for various projects. Most are simple, single-purpose tools that solve specific problems I've encountered. Some don't have any practical applications, and I think that's neat.
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
                    $prevUrl = "/code?" . http_build_query([
                        'page' => $page - 1,
                        'limit' => $limit
                    ]);
                    ?>
                    <a href="<?= $prevUrl ?>" class="button" aria-label="Previous page">← Previous</a>
                <?php endif; ?>
                
                <span>Page <?= $page + 1 ?></span>
                
                <?php if (($page + 1) * $limit < $totalItems): ?>
                    <?php 
                    $nextUrl = "/code?" . http_build_query([
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
                        $limitUrl = "/code?" . http_build_query([
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
                        <div class="icon"><img src="<?= htmlspecialchars($summary['icon'] ?? '') ?>"/></div>
                        <div class="text">
                            <h3>
                                <a href="/code/<?= htmlspecialchars($summary['slug'] ?? '') ?>">
                                    <?= htmlspecialchars($summary['name'] ?? 'Unnamed Tool') ?>
                                </a>
                            </h3>
                            <hr />
                            <p><?= htmlspecialchars($summary['summary'] ?? '') ?></p>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
            <?php else: ?>
                <p>No tools found.</p>
            <?php endif; ?>
        </div>
    </div>    
</div>
<?php
$bodyData = ob_get_clean();
?>
