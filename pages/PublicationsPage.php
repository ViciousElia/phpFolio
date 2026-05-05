<?php
$headData = "";
$bodyData = "";

// Build the head
ob_start();
?>
<title>Publications | Books by Terra Macdonald | Fruit Folio</title>
<meta name="description" content="Published works by Terra Macdonald including Rambling to an Empty Room, Assorted (miss)Adventures, and Ember of Hope. Available on Amazon." />
<link rel="stylesheet" href="/styles/publications.css">
<?php
$headData = ob_get_clean();

// Build the body
ob_start();
?>
<div class="content-frame">
    
    <!-- Hero/Intro Section -->
    <section class="publications-hero">
        <h1>Publications</h1>
        <p class="subtitle">Books and other projects by Terra Macdonald</p>
        
        <div class="intro-text">
            <p>Writing is a passion of mine. The ability to share stories and knowledge is one of the cornerstones of human experience, and I'm proud to be a part of that at every opportunity. While some of my work is rough and not as polished, I'm always keen to share what I'm up to.</p>
        </div>
    </section>

    <div class="serial-banner">
        <div class="serial-image">
            <img src="/public/vectors/thorns.svg"/>
        </div>
        <div class="serial-text">
            <h2>Ongoing Serial: <em>A Tale of Thorns</em></h2>
            <p>Follow along with my long-form story, updated regularly. It's an exploration of how our choices have broader impacts, but more than that, it's a story of one woman's experience of death.</p>
            <a href="https://rose.fruitfolio.com/" class="btn btn-secondary">Start Reading →</a>
        </div>
    </div>

    <!-- Published Books -->
    <section class="publications-section">
        <h2>Published Books</h2>
        
        <div class="book-card">
            <div class="book-content">
                <div class="book-text">
                    <h3><em>Taming the Sea: Song of Returning</em> <span class="years">(2017 - 2025)</span></h3>
                    
                    <p>In the bustling port city of Portstown, where the sea air carries the chill of early autumn and the promise of danger, five strangers find their fates intertwined. Kallista, a cloaked outcast with a hidden identity; Bella, a sailor seeking freedom from her past; Kyoto, a merfolk scribe down on his luck; Zale, a gillfolk woman desperate for connection; and Scarlet, a deadly agent of a mysterious Lady. Each is drawn by a cryptic job posting that offers gold, adventure, and a chance to escape their old lives.</p>
                    <p>The first installment in a dramatic retelling of a Pathfinder campaign set in the world of Naruul. I began DMing this game in 2017, and it's still ongoing as of 2025, though we're on hiatus.</p>
                    <p>As always, thanks to Christopher Sample and his social circle for trusting me with this beautiful world and the wild stories we tell in it.</p>
                    
                    <div class="amazon-link">
                        <a href="https://www.amazon.com/dp/B0FTLJ57YY" class="btn">Available on Amazon →</a>
                    </div>
                </div>

                <div class="book-cover">
                    <a href="https://www.amazon.com/dp/B0FTLJ57YY">
                        <img src="/public/rasters/returningCover.png" alt="Cover of Song of Returning by Terra Hyde" loading="lazy">
                    </a>
                </div>
            </div>
        </div>

        <div class="book-card">
            <div class="book-content reverse">
                <div class="book-text">
                    <h3><em>Pages and Paramours: Dewey Decimal Dating</em> <span class="years">(2025)</span></h3>
                    
                    <p>Not everyone is looking for love when she finds it, and certainly not Cherry when she's going out for her regular afternoon on one otherwise ordinary Wednesday afternoon. At first she's convinced she's hearing voices. Or maybe the library has been infested with some manner of fae being. In any case, she's intrigued and excited.</p>
                    <p>What started as an experiment and an experience has grown into a full spectrum of delightful cosy sapphic storytelling. This is the first of several books about a fictional Colorado town and the women who inhabit it.</p>
                    <p>If you happen to like it, this one exists thanks to my friend <a href="https://www.etsy.com/shop/SageMothCrafts">Rook</a>, who gave me the ideas for the characters of the first like 4 entries.</p>
                    
                    <div class="amazon-link">
                        <a href="https://www.amazon.com/dp/B0DWKQ27RC" class="btn">Available on Amazon →</a>
                    </div>
                </div>
                
                <div class="book-cover">
                    <a href="https://www.amazon.com/dp/B0DWKQ27RC">
                        <img src="/public/rasters/decimalCover.png" alt="Cover of Dewey Decimal Dating by Terra Hyde" loading="lazy">
                    </a>
                </div>
            </div>
        </div>

        <div class="book-card">
            <div class="book-content">
                <div class="book-text">
                    <h3><em>Rambling to an Empty Room</em> <span class="years">(2013 - 2024)</span></h3>
                    
                    <p>A short collection of rants, poems, short stories, and other more or less standard literary forms presented as observations about life, the universe, and ... well ... some things.</p>
                    <p>Many of the stories here are posted as <a href="/writing/quickies/">Quickies</a>, but about half of them are pieces that have never previously been released publicly.</p>
                    <p>There's no real through-line to this one. The closest we get is our favourite <em>definitely</em> neurotypical <em>certainly not a self-insert</em> <a href="/writing/quickies/?tags=fran">Fran</a>.</p>
                    
                    <div class="amazon-link">
                        <a href="https://www.amazon.com/dp/B0D915FYYX" class="btn">Available on Amazon →</a>
                    </div>
                </div>
                
                <div class="book-cover">
                    <a href="https://www.amazon.com/dp/B0D915FYYX">
                        <img src="/public/rasters/ramblingCover.webp" alt="Cover of Rambling to an Empty Room by Terra Hyde" loading="lazy">
                    </a>
                </div>
            </div>
        </div>
        
        <div class="book-card">
            <div class="book-content reverse">
                <div class="book-text">
                    <h3><em>Assorted (miss)Adventures</em> <span class="years">(2018 - 2023)</span></h3>
                    
                    <p>What does it mean to be immortal? To never die, never be killed, always surviving beyond all reasonable odds? The Cursed Immortal goes through life discovering this question's most uncomfortable answer:</p>
                    <p><strong>Loss.</strong></p>
                    <p>As we watch her learn and grow, we encounter just a few of the lives she touched, seeing the positive impact she had in spite of all the hurt she had to suffer. It's in one of these lives that she finally finds a reason to keep going, but even that is taken away far too soon.</p>
                    <p><em>Assorted (miss)Adventures</em> was the first book I ever finished. The initial draft was my <a href="https://nanowrimo.org/">NaNoWriMo</a> project in 2018. I tried to work on it for the next several years to no avail, but I finally finished editing, adding appendices, and designing the book (including layout and so much more), and it's finally a real book. Can't say how happy that makes me.</p>
                    <p>This is also the first book published within the fantasy setting called Naruul. Christopher Sample, the originator of the setting, left me to my own devices for this volume, and it grew into something incredibly big. It's not perfect by any stretch, but this is truthfully something of which I am entirely proud.</p>
                    
                    <div class="amazon-link">
                        <a href="https://a.co/d/gFoLTkE" class="btn">Available on Amazon →</a>
                    </div>
                </div>
                
                <div class="book-cover">
                    <a href="https://a.co/d/gFoLTkE">
                        <img src="/public/rasters/asstdCover.webp" alt="Cover of Assorted (miss)Adventures by Terra Hyde" loading="lazy">
                    </a>
                </div>
            </div>
        </div>
        
        <div class="book-card">
            <div class="book-content">
                <div class="book-text">
                    <h3><em>Ember of Hope</em> <span class="years">(2019 - 2023)</span></h3>
                    
                    <p>When Chloe's boyfriend becomes her fiancé, she hopes her life is finally starting to come together, but an encounter with her past leads her down a rabbit hole of family drama, pain, and a betrayal deeper than she could have ever expected. Bouncing back and forth between the various players in the story, we see the darkness unfold and envelope each member in turn. And all the while, every story finds its way back to one small artifact: a necklace made in love and tainted by the horrors of life.</p>
                    <p>This story was born of a dream diary that became much much more. It's not my most elegant, eloquent, or otherwise good writing, but it's something that I put a lot of time into. Several times, I was certain I wouldn't keep going, but then something else would happen. Outside of the dreams that inspired the original narrative, many events are based on or directly pulled from my personal experience, and that shines through with characters who make ... choices. We won't call them smart.</p>
                    <p>"A soap opera in book form" is the description used by early readers of this dramatic tale of romance, joy, suffering, and intrigue. It's not a typical love story or even anything close to the sort. Right from page 2, there's something bigger at play, and only further exploration will reveal how it all comes together.</p>
                    
                    <div class="amazon-link">
                        <a href="https://a.co/d/btZBbBr" class="btn">Available on Amazon →</a>
                    </div>
                </div>
                
                <div class="book-cover">
                    <a href="https://a.co/d/btZBbBr">
                        <img src="/public/rasters/emberCover.webp" alt="Cover of Ember of Hope by Terra Hyde" loading="lazy">
                    </a>
                </div>
            </div>
        </div>
    </section>
    
    <section class="upcoming-section">
        <h2>Upcoming Projects</h2>
        
        <div class="upcoming-grid">
            <div class="project-card">
                <h4>A Social Nuisance</h4>
                <p>A particular family in Naruul is not just a mild headache, but essentially a plague on the world around them. We follow the family Fencemend through some iconic moments and learn quite a lot about the limits of "respectability". And maybe we find love along the way.</p>
            </div>
            
            <div class="project-card">
                <h4>Children of a Dead God</h4>
                <p>In a world where magic died long ago, Nerisc Sendol fights to discover the truth of what happened and why they are experiencing bizarre things all around them. Everything they think they know is rocked by the discovery of a journal from before it all went wrong.</p>
            </div>
            
            <div class="project-card">
                <h4>The Record Keepers</h4>
                <p>Every single person matters. From the smallest babe to the wisest old soul. From the kindest to the most wicked. And in one small corner of a space between worlds, an office is dedicated to recording every moment of import. Unexpected guests are the last thing they need.</p>
            </div>
            
            <div class="project-card">
                <h4>Naruul: A World Guide</h4>
                <p>Naruul is a new fantasy setting created by Christopher Sample. This world guide will collect all our resources and set them up for use by anyone who wants to tell stories in Naruul. It'll include some basics for using the setting as a Table-Top game as well!</p>
            </div>
            
            <div class="project-card">
                <h4>Rambling to an Unhearing Void</h4>
                <p>The next collection of Ramblings. Like I said. I write a LOT. A lot a lot.</p>
            </div>
        </div>
    </section>
    
</div>
<?php
$bodyData = ob_get_clean();
?>