<?php
$headData = "";
$bodyData = "";

require_once 'lib/QuickieValidator.php';
$validator = new QuickieValidator();
$allQuickies = $validator->getAllItems();
$latestQuickie = null;
usort($allQuickies, function($a, $b) {
    $dateA = $a['file_path'];
    $dateB = $b['file_path'];
    return strcmp($dateB, $dateA); // Newest first
});
if (!empty($allQuickies)) $latestQuickie = $allQuickies[0];

ob_start();
?>
<title>Fruit Folio by Terra Hyde</title>
<meta name="description" content="Writing, thoughts, and occasional code from Terra Hyde. Short stories, technical documentation, and professional writing samples." />
<link rel="stylesheet" href="/styles/home.css">
<?php
$headData = ob_get_clean();

// Build the body
ob_start();
?>
<div class="content-frame home-page">
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <div class="hero-image">
                <img src="/public/rasters/Terra_Dress_Up.jpg" alt="Terra Hyde" loading="lazy">
            </div>
            <div class="hero-text">
                <h1>Terra Hyde</h1>
                <p class="tagline">Writer, developer, and occasional human being.</p>
                <p class="intro">Think of this website as a digital portfolio and a place where you can read the weird stuff I write. Honestly, if you're here, you probably already know me. So you know I write a lot. Some of the shorter things end up here. Some of the better things end up in my books.</p>
            </div>
        </div>
    </section>

    <?php if ($latestQuickie): ?>
    <section class="latest-writing">
        <h2>Latest Quickie</h2>
        <div class="quickie-preview">
            <h3>
                <a href="/writing/quickies/<?= htmlspecialchars($latestQuickie['id'] ?? '') ?>">
                    <?= htmlspecialchars($latestQuickie['title'] ?? 'Latest Writing') ?>
                </a>
            </h3>
            <p><?= htmlspecialchars($latestQuickie['summary'] ?? '') ?></p>
            <a href="/writing/quickies/<?= htmlspecialchars($latestQuickie['id'] ?? '') ?>" class="read-more">
                Read this quickie →
            </a>
        </div>
        <div class="section-footer">
            <a href="/writing/quickies" class="see-all">Browse all quickies</a>
        </div>
    </section>
    <?php endif; ?>

    <!-- Main Navigation Grid -->
    <section class="nav-grid">
        <div class="grid-item">
            <h3><a href="/writing/quickies">Quickies</a></h3>
            <p>Short stories, thoughts, and occasional rants. Plenty here.</p>
        </div>
        
        <div class="grid-item">
            <h3><a href="/writing/samples">Professional Samples</a></h3>
            <p>Some samples of my technical writing. This includes documentation of processes, documentation of concepts, and diagrams as needed.</p>
        </div>
        
        <div class="grid-item">
            <h3><a href="/about">About</a></h3>
            <p>Who I am, what I do, and why this site exists. Also, a bit about my family!</p>
        </div>
        
        <div class="grid-item">
            <h3><a href="/contact">Contact</a></h3>
            <p>Ways to get in touch. If you must. Not that I prefer it, though.</p>
        </div>
    </section>

</div>
<?php
$bodyData = ob_get_clean();
?>