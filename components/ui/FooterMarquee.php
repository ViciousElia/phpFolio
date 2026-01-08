<?php
namespace Components;

require_once 'components/BaseComponent.php';

class FooterMarquee extends BaseComponent {
    private array $footerMarquee = [
        'Do Good.',
        'Know You Matter.',
        'Only Be Vicious as Necessary.'
    ];

    public static function render(): string {
        // Create instance to access instance methods
        $instance = new static();
        return $instance->generateMarquee();
    }

    private function generateMarquee(): string {
        ob_start();
        ?>
        <div class="foot-marquee">
            <?php foreach($this->footerMarquee as $item){
                echo '<h4>'.($item).'</h4>';
            }
            ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
?>