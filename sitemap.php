<?php
    header('Content-Type: application/xml');
    /* create a dom document with encoding utf8 */
    $domtree = new DOMDocument('1.0', 'UTF-8');

    /* create a urlset element and append it to xmlRoot */
    $urlSet = $domtree->createElement("urlset");
    $urlSet->setAttribute("xmlns","http://www.sitemaps.org/schemas/sitemap/0.9");
    $urlSet = $domtree->appendChild($urlSet);

/******************************************************************************/
    /* create entries for loose pages */
    $curPage = $domtree->createElement("url");
    $curPage->appendChild($domtree->createElement("loc", "https://fruitfolio.com"));
    $curPage = $urlSet->appendChild($curPage);
    $curPage = $domtree->createElement("url");
    $curPage->appendChild($domtree->createElement("loc", "https://fruitfolio.com/contact"));
    $curPage = $urlSet->appendChild($curPage);
    $curPage = $domtree->createElement("url");
    $curPage->appendChild($domtree->createElement("loc", "https://fruitfolio.com/about"));
    $curPage = $urlSet->appendChild($curPage);
    $curPage = $domtree->createElement("url");
    $curPage->appendChild($domtree->createElement("loc", "https://fruitfolio.com/publications"));
    $curPage = $urlSet->appendChild($curPage);
    $curPage = $domtree->createElement("url");
    $curPage->appendChild($domtree->createElement("loc", "https://fruitfolio.com/writing/samples"));
    $curPage = $urlSet->appendChild($curPage);
/******************************************************************************/
    /* create entries for quickies */
    $curPage = $domtree->createElement("url");
    $curPage->appendChild($domtree->createElement("loc", "https://fruitfolio.com/writing/quickies"));
    $curPage = $urlSet->appendChild($curPage);

    require_once 'lib/QuickieValidator.php';
    $validator = new QuickieValidator();
    $quickies = $validator->getAllItems();

    foreach($quickies as $quickie){
        $curPage = $domtree->createElement("url");
        $curPage->appendChild($domtree->createElement("loc", "https://fruitfolio.com/writing/quickies/".$quickie['id']));
        $curPage = $urlSet->appendChild($curPage);
    }
/******************************************************************************/
    /* create entries for code */
    $curPage = $domtree->createElement("url");
    $curPage->appendChild($domtree->createElement("loc", "https://fruitfolio.com/code"));
    $curPage = $urlSet->appendChild($curPage);

    require_once 'lib/CodeToolValidator.php';
    $validator = new CodeToolValidator();
    $tools = $validator->getAllItems();

    foreach($tools as $tool){
        $curPage = $domtree->createElement("url");
        $curPage->appendChild($domtree->createElement("loc", "https://fruitfolio.com/code/".$tool['slug']));
        $curPage = $urlSet->appendChild($curPage);
    }
/******************************************************************************/
    /* get the xml printed */
    $domtree->preserveWhiteSpace = false;
    $domtree->formatOutput = true;
    echo $domtree->saveXML();
?>