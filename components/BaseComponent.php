<?php
namespace Components;

abstract class BaseComponent {
    protected array $props = [];
    
    public function __construct(array $props = []) {
        $this->props = $props;
    }
    
    abstract public static function render(): string;
    
    protected function prop(string $key, $default = null) {
        return $this->props[$key] ?? $default;
    }
    
    protected function escape(string $value): string {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}
?>