<?php
$headData = "";
$bodyData = "";


// ============================================
// CUSTOMIZATION POINT: HEAD CONTENT
// ============================================

ob_start();
?>
<title>Downloads | Fruit Folio</title>
<meta name="description" content="A collection of files I make freely available for download." />
<style>
    table { border : solid 1px black; margin : auto; }
    td { padding-left : 2rem; padding-right : 2rem; border-bottom : solid lightgrey 1px; border-right : solid black 1px;}
    th { text-align : center; border-bottom : solid 1px black; cursor: pointer;}
    tr:nth-child(2n) { background-color : #333; }
    thead tr { background-color : #222; }
</style>
<?php
$headData = ob_get_clean();


// ============================================
// CUSTOMIZATION POINT: BODY CONTENT
// ============================================

ob_start();
?>
<div class="content-frame">
    
<h2>Downloads</h2>
<hr />
<p>I'll make this pretty at some point ... not today.</p>
<h3>eBooks</h3>
<table id="table">
    <thead>
        <tr>
            <th id="Title" onclick="sortItems('Title')">Title</th>
            <th id="Date" onclick="sortItems('Date')">Date</th>
            <th id="Series" onclick="sortItems('Series')">Series</th>
            <th id="Entry" onclick="sortItems('Entry')">Entry</th>
            <th>PDF</th>
            <th>EPUB</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>

</div>
<script>
    // script.js 
    
    // For edit item 
    let index = -1; 
    const table = document.getElementById("table"); 
    
    // For sorting ascending or descending 
    const flag = { Title: false, Date: false, Series: false, Entry: false, PDF: false, EPUB: false}; 
    let data = [ 
        {Title: "Ember of Hope",              Date: "2023-06-26",  Series: "",                                  Entry: "",  PDF: '<a href="/docs/Ember_of_Hope.pdf">[download]</a>',             EPUB: '<a href="/docs/Ember_of_Hope.epub">[download]</a>'}, 
        {Title: "Assorted (miss)Adventures",  Date: "2023-10-07",  Series: "Naruul Narratives",                 Entry: "1", PDF: '<a href="/docs/Assorted_miss-Adventures.pdf">[download]</a>',  EPUB: '<a href="/docs/Assorted_miss-Adventures.epub">[download]</a>'}, 
        {Title: "Rambling to an Empty Room",  Date: "2024-10-07",  Series: "Ramblings",                         Entry: "1", PDF: '<a href="/docs/Rambling_to_an_Empty_Room.pdf">[download]</a>', EPUB: '<a href="/docs/Rambling_to_an_Empty_Room.epub">[download]</a>'}, 
        {Title: "Dewey Decimal Dating",       Date: "2025-04-04",  Series: "Pages and Paramours",               Entry: "1", PDF: '<a href="/docs/PnP-Dewey_Decimal_Dating.pdf">[download]</a>',  EPUB: '<a href="/docs/PnP-Dewey_Decimal_Dating.epub">[download]</a>'}, 
        {Title: "Song of Returning",          Date: "2025-10-07",  Series: "Taming the Sea",                    Entry: "1", PDF: '<a href="/docs/TtS-Song_of_Returning.pdf">[download]</a>',     EPUB: '<a href="/docs/TtS-Song_of_Returning.epub">[download]</a>'}, 
        {Title: "Refrain of Terror",          Date: "coming soon", Series: "Taming the Sea",                    Entry: "2", PDF: "[not available]",                                              EPUB: "[not available]"}, 
        {Title: "Quills, Kisses, and Curios", Date: "coming soon", Series: "Pages and Paramours",               Entry: "2", PDF: "[not available]",                                              EPUB: "[not available]"}, 
        {Title: "Seasons and Sweethearts",    Date: "coming soon", Series: "Pages and Paramours",               Entry: "3", PDF: "[not available]",                                              EPUB: "[not available]"}, 
        {Title: "Refactored Devotion",        Date: "coming soon", Series: "Pages and Paramours",               Entry: "4", PDF: "[not available]",                                              EPUB: "[not available]"}, 
        {Title: "Deithe Tal Region Guide",    Date: "coming soon", Series: "The Multiverse According to Dot",   Entry: "1", PDF: "[not available]",                                              EPUB: "[not available]"}, 
        {Title: "Lafleur World Guide",        Date: "coming soon", Series: "The Multiverse According to Dot",   Entry: "2", PDF: "[not available]",                                              EPUB: "[not available]"}, 
        {Title: "Portstown City Guide",       Date: "coming soon", Series: "The Multiverse According to Dot",   Entry: "3", PDF: "[not available]",                                              EPUB: "[not available]"}, 
        {Title: "Rambling to the Void",       Date: "coming soon", Series: "Ramblings",                         Entry: "2", PDF: "[not available]",                                              EPUB: "[not available]"}, 
        {Title: "A Social Nuisance",          Date: "coming soon", Series: "The Incorrigible Family Fencemend", Entry: "1", PDF: "[not available]",                                              EPUB: "[not available]"}
    ]; 

    // To create table 
    function addItem(e, i) { 
        row = table.insertRow(i + 1); 
        let c0 = row.insertCell(0); 
        let c1 = row.insertCell(1); 
        let c2 = row.insertCell(2); 
        let c3 = row.insertCell(3); 
        let c4 = row.insertCell(4); 
        let c5 = row.insertCell(5); 
        c0.innerText = e.Title; 
        c1.innerText = e.Date; 
        c2.innerText = e.Series; 
        c3.innerText = e.Entry; 
        c4.innerHTML = e.PDF; 
        c5.innerHTML = e.EPUB; 
    } 
    
    // Traverse and insert items to table 
    data.map((e, i) => addItem(e, i)); 
    
    // For sorting
    function sortItems(title) { 
        remove(); 

        data.sort((a, b) => { 
            let fa = a[title].toLowerCase(), 
                fb = b[title].toLowerCase(); 

            if (fa < fb) { 
                return -1; 
            } 
            if (fa > fb) { 
                return 1; 
            } 
            return 0; 
        }); 
        if (flag[title]) data.reverse(); 
        flag[title] = !flag[title]; 

        data.map((e, i) => addItem(e, i)); 
    } 
    
    // Clear the table before updation 
    function remove() { 
        while (table.rows.length > 1) table.deleteRow(-1); 
    } 
</script>
<?php
$bodyData = ob_get_clean();
?>