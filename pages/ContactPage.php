<?php
$headData = "";
$bodyData = "";

// Build the head
ob_start();
?>
<title>Contact Terra Macdonald | Fruit Folio</title>
<meta name="description" content="Get in touch with Terra Macdonald for writing inquiries, collaboration, or just to say hello. Response within 3-5 business days." />
<link rel="stylesheet" href="/styles/contact.css">
<?php
$headData = ob_get_clean();

// Build the body
ob_start();
?>
<div class="content-frame">
    
    <!-- Hero/Intro Section -->
    <section class="contact-hero">
        <h1>Get in Touch</h1>
        <p class="subtitle">Ways to reach out for work, questions, or conversation</p>
    </section>
    
    <!-- Contact Content -->
    <section class="contact-content">
        <div class="contact-grid">
            
            <!-- Contact Form -->
            <div class="contact-form-section">
                <h2>Send a Message</h2>
                
                <form action="/lib/sendForm.php" method="post" class="contact-form">
                    <div class="form-group">
                        <label for="uname">Your name</label>
                        <input type="text" id="uname" name="uname" required placeholder="How should I address you?">
                    </div>
                    
                    <div class="form-group">
                        <label for="uemail">Your email</label>
                        <input type="email" id="uemail" name="uemail" required placeholder="Where can I reply?">
                    </div>
                    
                    <div class="form-group">
                        <label for="usubj">Subject</label>
                        <input type="text" id="usubj" name="usubj" required placeholder="What's this about?">
                    </div>
                    
                    <div class="form-group">
                        <label for="umess">Your message</label>
                        <textarea id="umess" name="umess" rows="5" maxlength="1000" required placeholder="What would you like to say? (1000 characters max)"></textarea>
                        <div class="char-count"><span id="char-counter">0</span>/1000 characters</div>
                    </div>
                    
                    <button type="submit" class="btn btn-submit">
                        Send Message →
                    </button>
                </form>
            </div>
            
            <!-- Contact Info & Notes -->
            <div class="contact-info-section">
                <h2>Response Time & Expectations</h2>
                <div class="contact-card">
                    <div class="info-block">
                        <h3>📧 Direct Email</h3>
                        <p>
                            <a href="mailto:terra@fruitfolio.com" class="email-link">terra@fruitfolio.com</a>
                        </p>
                        <p class="note">Prefer email? Use this address for a more direct line.</p>
                    </div>
                    
                    <div class="info-block">
                        <h3>⏱️ Turnaround Time</h3>
                        <p>I aim to respond within <strong>3-5 business days</strong>.</p>
                        <p>If you don't hear back within 10 business days, please reach out again — sometimes emails get lost in the chaos!</p>
                    </div>
                    
                    <div class="info-block">
                        <h3>📋 Best For</h3>
                        <ul class="best-for-list">
                            <li>Writing inquiries & collaborations</li>
                            <li>Technical documentation projects</li>
                            <li>Questions about my work</li>
                            <li>General conversation</li>
                        </ul>
                    </div>
                </div>
            </div>
            
        </div>
    </section>
    
</div>

<script>
// Character counter for message textarea
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('umess');
    const counter = document.getElementById('char-counter');
    
    if (textarea && counter) {
        textarea.addEventListener('input', function() {
            counter.textContent = this.value.length;
        });
        
        // Initialize counter
        counter.textContent = textarea.value.length;
    }
});
</script>
<?php
$bodyData = ob_get_clean();
?>