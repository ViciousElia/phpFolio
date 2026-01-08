<?php
$headData = "";
$bodyData = "";

// Build the head
ob_start();
?>
<title>About Terra Hyde | Fruit Folio</title>
<meta name="description" content="Terra Hyde: writer, developer, mathematician, and sapphic trans woman from Texas now living in Colorado with her family." />
<link rel="stylesheet" href="/styles/about.css">
<?php
$headData = ob_get_clean();

// Build the body
ob_start();
?>
<div class="content-frame">
    
    <!-- Hero/Intro Section -->
    <section class="about-hero">
        <h1>Terra Hyde</h1>
        <p class="subtitle">Writer, developer, mathematician, and occasional tree-climber</p>
        
        <div class="intro-text">
            <p>My name is Terra. I'm ... a lot of things to a lot of people. A Jill-of-All-Trades type, to be honest. Why not Jack? Because I've never particularly cared for Jack. Too masculine for my taste. It's like calling a girl "guy" or "dude". Just no thanks.</p>
            <p>But enough about me, let's talk about me!</p>
        </div>
    </section>
    
    <!-- Professional Section -->
    <section class="about-section">
        <h2>Professional</h2>
        
        <div class="section-content">
            <div class="skills-grid">
                <div class="skill-icon">
                    <div class="text-icon">C/C++/ASM</div>
                    <span>Systems & Embedded</span>
                </div>
                <div class="skill-icon">
                    <div class="text-icon">C#/Java/Kotlin</div>
                    <span>High-Level OOP</span>
                </div>
                <div class="skill-icon">
                    <div class="text-icon">Python/Perl/Lua</div>
                    <span>Scripting & Automation</span>
                </div>
                <div class="skill-icon">
                    <div class="text-icon">LaTeX/XML/Markdown/<br />Mermaid/PostScript</div>
                    <span>Documentation</span>
                </div>
                <div class="skill-icon">
                    <div class="text-icon">PHP/HTML/CSS/JS</div>
                    <span>Web Development</span>
                </div>
                <div class="skill-icon">
                    <div class="text-icon">R/MATLAB/SQL/SPSS</div>
                    <span>Data & Analysis</span>
                </div>
            </div>            

            <div class="section-text">
                <p>I am self taught in several different coding languages (including the various languages I used to build this site), but I also took the opportunity to learn many more coding, scripting, and typesetting languages in university.</p>
                <p>I studied mathematics with a focus in applied mathematics and physics. This allowed me to learn C/C++/Objective C, Java, Python, R, MATLAB, Mathematica, LaTeX and PostScript by the time I got my Master of Science in Mathematics.</p>
                <p>I have a passion for education and social awareness, so I use every opportunity I have to help people learn what they need to know about everything I can tell them.</p>
                <p class="resume-link"><a href="/public/samples/TerraHydeCompleteResume.pdf">📄 View my complete resume (PDF)</a></p>
            </div>
        </div>
    </section>
    
    <!-- Personal Section -->
    <section class="about-section">
        <h2>Personal</h2>
        
        <div class="section-content reverse">
            <div class="section-text">
                <p>I'm a sapphic trans woman from a tiny town in East Texas.</p>
                <p>Why'd I include that first part? Because it matters. Every part of my person is important to who I am as an artist, author, partner, friend, coder, et c. The trans part because it's important to me to be a visible and vocal presence to provide comfort to the young folks who need to know it gets better. The sapphic part because if you can't accept me and who I love as a package, then you can get the heck out!</p>
                <p>The second part is important because it explains how I became who I am today! Surrounded by churches and pine trees, there wasn't much to do except explore while outside and learn while inside. So I did exactly that. I learned everything I could about everything I could, and then I got the heck out and started being a real person!</p>
            </div>
            
            <div class="family-grid">
                <div class="family-member">
                    <img src="/public/rasters/terraFruit.jpg" alt="Terra Hyde in a tree wearing blue jeans, red tank top, and green boots" loading="lazy">
                    <div class="member-info">
                        <h4>Terra</h4>
                        <p>Like I said. I spent a lot of time exploring as a kid. Even today I still climb trees, big rocks, and whatever else I can find a way to scale!</p>
                    </div>
                </div>
                
                <div class="family-member">
                    <img src="/public/rasters/katieBirb.jpg" alt="Katherine Macdonald at Sand Dunes National Park in Colorado" loading="lazy">
                    <div class="member-info">
                        <h4>Katie</h4>
                        <p>This is my beautiful partner Katie! She and I met through work in 2021 and have been spending time in person since 2022. We're pretty happy together!</p>
                    </div>
                </div>
                
                <div class="family-member">
                    <img src="/public/rasters/miniFruit.jpg" alt="Terra's daughter at the zoo, hanging from red bars and smiling" loading="lazy">
                    <div class="member-info">
                        <h4>Mini</h4>
                        <p>This is my beautiful daughter! I won't be sharing her name outright. Nor will I be posting more pics of her (except the occasional update pic). I love her, and she makes me super heckin proud.</p>
                    </div>
                </div>
                
                <div class="pet-grid">
                    <div class="pet">
                        <img src="/public/rasters/cinderCat.jpg" alt="Tabby cat named Cinder sitting on a gouache palette" loading="lazy">
                        <div class="pet-info">
                            <h4>Cinder</h4>
                            <p>My cat. An incarnation of chaos, but we love her.</p>
                        </div>
                    </div>
                    
                    <div class="pet">
                        <img src="/public/rasters/gooseDog.jpg" alt="Mini Australian Shepherd named Zeus looking curiously at the camera" loading="lazy">
                        <div class="pet-info">
                            <h4>Zeus</h4>
                            <p>Katie's dog. A sweetheart who comes with us on most vacations.</p>
                        </div>
                    </div>
                    
                    <div class="pet">
                        <img src="/public/rasters/henryCat.jpg" alt="Tabby cat named Henry sitting on a deck chair" loading="lazy">
                        <div class="pet-info">
                            <h4>Henry</h4>
                            <p>Katie's cat. A crotchety old man, and that is honestly his most endearing quality.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Social Section -->
    <section class="about-section">
        <h2>Social & Hobbies</h2>
        
        <div class="section-content">
            <div class="hobby-item">
                <img src="/public/rasters/naruulMap.webp" alt="Map of the fictional continent of Law and Chaos in the world of Naruul" loading="lazy">
                <div class="hobby-info">
                    <h4>Tabletop Gaming</h4>
                    <p>The primary game my friends play is Pathfinder with a homebrew setting called Naruul, which was created by Christopher Sample and expanded by community consensus.</p>
                </div>
            </div>
            
            <div class="section-text">
                <p>My primary social activity when I lived in Texas was table top gaming. Collaborative storytelling as a whole was always something that appealed to me, and my friends in Austin allowed me to really express that!</p>
                <p>In addition to table-top roleplaying games, I love getting involved with karaoke and other ridiculous gatherings. Probably my favourite is the alternative holiday celebrations my friends have in response to the fact that we come from all walks of life.</p>
                <p>I also play online games when I have time and even stream on Twitch from time to time.</p>
            </div>
        </div>
    </section>
    
</div>
<?php
$bodyData = ob_get_clean();
?>