<?php
namespace Components;

require_once 'components/BaseComponent.php';
require_once 'components/ui/FooterMarquee.php';
require_once 'components/ui/FooterPages.php';
require_once 'components/ui/Logo.php';

class Footer extends BaseComponent {
    public static function render(array $props = []): string {
        $marquee = FooterMarquee::render();
        $logo = Logo::render();
        $pages = FooterPages::render(); 
        $year = date("Y");
        return <<<HTML
            <link rel="stylesheet" href="/styles/footer.css">
            <footer>
                $marquee
                <div class="foot-main">
                    $logo
                    $pages
                </div>
            <hr />
            <div class="foot-claim"><p>Coded happily in PHP and SQL, but unhappily in JS, HTML, and CSS. All from a small office in Colorado.</p></div>
            <div class="foot-copy"><p>Copyright &copy; Terra Macdonald 2024 - $year</p></div>
            </footer>
        HTML;
    }
}
?>