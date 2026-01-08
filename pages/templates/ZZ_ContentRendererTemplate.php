<?php
/**
 * Generic Content Renderer Template
 * 
 * PURPOSE:
 * This template provides the base structure for rendering any content type
 * in PHP Folio. It handles YAML frontmatter parsing, Markdown rendering,
 * and output buffering for clean HTML generation.
 * 
 * USAGE:
 * 1. Copy this file to `pages/YourContentType.php`
 * 2. Customize the marked sections below
 * 3. Add your content type to `routes.php`
 * 4. Create a validator extending AbstractValidator
 * 
 * @package PHPFolio
 * @author Your Name
 */

$headData = "";
$bodyData = "";

if (isset($pageId)) {
    require_once 'lib/Parsedown.php';
    require_once 'lib/Spyc.php';
    $Parsedown = new Parsedown();

    // ============================================
    // CONFIGURATION SECTION - EDIT THESE VALUES
    // ============================================
    
    // 1. Set your content key (must match routes.php)
    $contentKey = 'your_content_data'; // e.g., 'quickie_data', 'tool_data'
    
    // 2. Define your content type name for breadcrumbs
    $contentTypeName = 'Your Content Type'; // e.g., 'Quickies', 'Code Tools'
    
    // 3. Define your listing page URL
    $listingPageUrl = '/path/to/listing'; // e.g., '/writing/quickies', '/code'
    
    // 4. Define your canonical URL pattern
    $canonicalUrlPattern = '/{category}/{identifier}'; // e.g., '/writing/quickies/{date}'
    
    // ============================================
    // END CONFIGURATION - DO NOT EDIT BELOW UNLESS CUSTOMIZING
    // ============================================
    
    if (file_exists($routeData[$contentKey]['file_path'])) {
        try {
            // Parse YAML frontmatter
            $content = file_get_contents($routeData[$contentKey]['file_path']);
            $offsetYAML = strpos($content, "\n---\n", 3);
            $yaml = substr($content, 4, $offsetYAML - 4);
            $content = substr($content, $offsetYAML + 5);
            $pageMeta = Spyc::YAMLLoadString($yaml);
            
            // ============================================
            // CUSTOMIZATION POINT: BODY CONTENT
            // ============================================
            
            ob_start();
            ?>
            <div class="content-frame">
                <!-- Breadcrumbs - Customize display field -->
                <div class="crumbs">
                    <a href="<?= $listingPageUrl ?>"><?= $contentTypeName ?></a> &gt; 
                    <?= $pageMeta['display_field'] ?? $pageMeta['title'] ?? 'Content' ?>
                </div>
                
                <!-- CUSTOMIZATION: Optional Header Section -->
                <?php if (isset($pageMeta['all_in_one']) && !empty($pageMeta['all_in_one'])): ?>
                <div class="content-header">
                    <p>Like what you see? Want to see how it works?</p>
                    <a href="<?= htmlspecialchars($pageMeta['all_in_one']) ?>" class="btn">
                        📦 Download Complete Package
                    </a>
                </div>
                <?php endif; ?>
                
                <!-- Main Content (Markdown rendered) -->
                <div class="content-main">
                    <?= $Parsedown->text($content) ?>
                </div>
                
                <!-- CUSTOMIZATION: Optional Footer Metadata -->
                <?php if (isset($pageMeta['tags']) || isset($pageMeta['date'])): ?>
                <div class="content-footer">
                    <hr />
                    
                    <?php if (isset($pageMeta['tags'])): ?>
                    <p>Tags:
                        <?php foreach ($pageMeta['tags'] as $index => $tag): 
                            $escapedTag = htmlspecialchars($tag, ENT_QUOTES, 'UTF-8');
                        ?>
                            <a href="<?= $listingPageUrl ?>?tag=<?= urlencode($tag) ?>">
                                <?= $escapedTag ?>
                            </a>
                            <?= $index < count($pageMeta['tags']) - 1 ? ' • ' : '' ?>
                        <?php endforeach; ?>
                    </p>
                    <?php endif; ?>
                    
                    <?php if (isset($pageMeta['words'])): ?>
                    <p>Words: <?= $pageMeta['words'] ?></p>
                    <?php endif; ?>
                    
                    <?php if (isset($pageMeta['date'])): ?>
                    <p>Date: <?= $pageMeta['date'] ?></p>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
            
            <!-- CUSTOMIZATION: Optional Scripts -->
            <?php if (isset($pageMeta['supporting_scripts'])): ?>
            <script>
                document.addEventListener("DOMContentLoaded", function(event) {
                    // Initialize any required scripts
                    <?php if (in_array('syntax_highlighting', $pageMeta['features'] ?? [])): ?>
                    highlightSyntax();
                    <?php endif; ?>
                });
            </script>
            <?php endif; ?>
            
            <?php
            $bodyData = ob_get_clean();
            
            // ============================================
            // CUSTOMIZATION POINT: HEAD CONTENT
            // ============================================
            
            ob_start();
            
            // Generate canonical URL
            $canonicalUrl = str_replace(
                ['{category}', '{identifier}'],
                [$contentKey, $pageMeta['slug'] ?? $pageId],
                $canonicalUrlPattern
            );
            ?>
            
            <title><?= $pageMeta['title'] ?? $pageMeta['name'] ?> | Fruit Folio</title>
            <meta name="description" content="<?= $pageMeta['description'] ?>" />
            
            <!-- Open Graph -->
            <meta property="og:title" content="<?= $pageMeta['title'] ?? $pageMeta['name'] ?> | Fruit Folio" />
            <meta property="og:description" content="<?= $pageMeta['summary'] ?? $pageMeta['description'] ?>" />
            <meta property="og:url" content="https://fruitfolio.com<?= $canonicalUrl ?>" />
            <meta property="og:image" content="/general/img/<?= $pageMeta['og_image'] ?? 'logoOG.png' ?>" />
            
            <link rel="canonical" href="https://fruitfolio.com<?= $canonicalUrl ?>" />
            
            <!-- CUSTOMIZATION: Schema.org Structured Data -->
            <?php if (isset($pageMeta['schema_type'])): ?>
            <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "<?= $pageMeta['schema_type'] ?>",
                "headline": "<?= $pageMeta['title'] ?? $pageMeta['name'] ?>",
                "description": "<?= $pageMeta['description'] ?>",
                "url": "https://fruitfolio.com<?= $canonicalUrl ?>",
                <?php if (isset($pageMeta['date'])): ?>"datePublished": "<?= $pageMeta['date'] ?>",<?php endif; ?>
                <?php if (isset($pageMeta['author'])): ?>"author": {
                    "@type": "Person",
                    "name": "<?= $pageMeta['author'] ?>"
                },<?php endif; ?>
                "publisher": {
                    "@type": "Organization",
                    "name": "Fruit Folio"
                }
            }
            </script>
            <?php endif; ?>
            
            <!-- CUSTOMIZATION: Additional Styles/Scripts -->
            <?php if (isset($pageMeta['additional_styles'])): ?>
            <?php foreach ((array)$pageMeta['additional_styles'] as $style): ?>
            <link rel="stylesheet" href="<?= $style ?>">
            <?php endforeach; ?>
            <?php endif; ?>
            
            <?php if (isset($pageMeta['supporting_scripts'])): ?>
            <?php foreach ((array)$pageMeta['supporting_scripts'] as $script): ?>
            <script src="<?= $script ?>"<?= strpos($script, '_late_load') !== false ? ' defer' : '' ?>></script>
            <?php endforeach; ?>
            <?php endif; ?>
            
            <?php
            $headData = ob_get_clean();
            
        } catch (Exception $e) {
            error_log("Content renderer error ({$contentKey}): " . $e->getMessage());
            include 'pages/500.php';
        }
    } else {
        include 'pages/404.php';
    }
} else {
    include 'pages/404.php';
}