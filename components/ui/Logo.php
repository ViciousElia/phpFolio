<?php
namespace Components;

require_once 'components/BaseComponent.php';

class Logo extends BaseComponent {
    public static function render(): string {
        $instance = new static();
        return $instance->generateLogo();
    }
    
    private function generateLogo(): string {
        return <<<HTML
        <link rel="stylesheet" href="/styles/logo.css">
        <div class="logo">
            <a href="/">
                <img src="/public/vectors/Folio.svg" alt="Logo" />
                <div>Fruit<br /> Folio</div>
            </a>
        </div>
        HTML;
    }
}
?>