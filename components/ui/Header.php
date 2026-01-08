<?php
namespace Components;

require_once 'components/BaseComponent.php';
require_once 'components/ui/Navigation.php';
require_once 'components/ui/Logo.php';

class Header extends BaseComponent {
    public static function render(array $props = []): string {
        $logo = Logo::render();
        $navMenu = new Navigation($props)->renderSelf(); 
        return <<<HTML
        <header>
            $logo
            $navMenu
        </header>
        HTML;
    }
}
?>