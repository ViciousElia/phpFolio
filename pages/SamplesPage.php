<?php
$headData = "";
$bodyData = "";

// Sample data array
$sampleData = [
    [
        'name' => 'Documentation Requests',
        'description' => 'Rationale, requirements, and templates for documentation requests from engineers for net new and existing docs in both narrative and technical content.',
        'docs' => [
            'pdf' => '/public/samples/Engineering_Requests.pdf',
            'tex' => '/public/samples/Engineering_Requests.tex'
        ]
    ],
    [
        'name' => 'Quick and Dirty SEO',
        'description' => 'A short, three-page guide for managing SEO in an eCommerce setting (specifically on the BigCommerce platform). Written to provide basic guidance with some rationale surrounding SEO-relevant fields found on most platforms.',
        'docs' => [
            'pdf' => '/public/samples/Quick_and_Dirty_SEO_(2024).pdf',
        ]
    ]
];

// Helper function to get file extension
function getFileExtension($filename) {
    return strtoupper(pathinfo($filename, PATHINFO_EXTENSION));
}

// Build the head data
ob_start();
?>
<title>Professional Writing Samples | Fruit Folio</title>
<meta name="description" content="Professional writing samples including documentation requests, SEO guides, and technical documentation templates." />
<meta property="og:title" content="<?=$pageTitle?> | Fruit Folio" />
<meta property="og:description" content="Professional writing samples including documentation requests, SEO guides, and technical documentation templates." />
<meta property="og:url" content="https://fruitfolio.com/writing/samples" />
<meta property="og:image" content="/general/img/logoOG.png" />
<link rel="canonical" href="https://fruitfolio.com/writing/samples" />
<link rel="stylesheet" href="/styles/samples.css">
<?php
$headData = ob_get_clean();

// Build the body data
ob_start();
?>
<div class="content-frame">
    <h1>Professional Writing Samples</h1>
    <p>A list of some professional writing samples. This includes work structure and format requests, diagrams, training plans, scoping template documents, and more. When necessary, I've removed proprietary data, but the structure and form of the documents is intact.</p>

    <blockquote><span>NOTE:</span> If you are using dark mode, several of the dropdowns below are extremely bright. Consider shielding your eyes.</blockquote>

    <?php foreach ($sampleData as $sample): ?>
    <details>
        <summary><?= htmlspecialchars($sample['name']) ?></summary>
        
        <?php if (!empty($sample['description'])): ?>
            <p><?= htmlspecialchars($sample['description']) ?></p>
        <?php endif; ?>
        
        <p>Download as:</p>
        <ul>
            <?php if (!empty($sample['code'])): ?>
                <?php foreach ($sample['code'] as $codeFile): ?>
                    <li>
                        <a href="<?= htmlspecialchars($codeFile) ?>">
                            <code><?= htmlspecialchars(getFileExtension($codeFile)) ?></code> Code
                        </a>
                    </li>
                <?php endforeach; ?>
            <?php endif; ?>
            
            <?php if (!empty($sample['docs']['pdf'])): ?>
                <li><a href="<?= htmlspecialchars($sample['docs']['pdf']) ?>">PDF (requires a PDF viewer)</a></li>
            <?php endif; ?>
            
            <?php if (!empty($sample['docs']['tex'])): ?>
                <li><a href="<?= htmlspecialchars($sample['docs']['tex']) ?>">LaTeX (requires a TeX compiler)</a></li>
            <?php endif; ?>
            
            <?php if (!empty($sample['docs']['odt'])): ?>
                <li><a href="<?= htmlspecialchars($sample['docs']['odt']) ?>">ODT (requires OpenOffice or LibreOffice)</a></li>
            <?php endif; ?>
            
            <?php if (!empty($sample['docs']['zip'])): ?>
                <li><a href="<?= htmlspecialchars($sample['docs']['zip']) ?>">Archive (requires a valid archive utility such as Unzip or gZip)</a></li>
            <?php endif; ?>
            
            <?php if (!empty($sample['docs']['tar'])): ?>
                <li><a href="<?= htmlspecialchars($sample['docs']['tar']) ?>">Tarball (requires Tar)</a></li>
            <?php endif; ?>
        </ul>
        
        <?php if (!empty($sample['code'])): ?>
            <pre></pre> <!-- will add this later ... when I get to it -->
        <?php elseif (!empty($sample['docs']['pdf'])): ?>
            <iframe 
                src="<?= htmlspecialchars($sample['docs']['pdf']) ?>#zoom=100" 
                title="<?= htmlspecialchars($sample['name']) ?>" 
                width="100%" 
                height="600px">
            </iframe>
        <?php elseif (!empty($sample['docs']['svg'])): ?>
            <div class="svg-box">
                <img src="<?= htmlspecialchars($sample['docs']['svg']) ?>" alt="<?= htmlspecialchars($sample['name']) ?>">
            </div>
        <?php endif; ?>
    </details>
    <?php endforeach; ?>
</div>
<?php
$bodyData = ob_get_clean();
?>