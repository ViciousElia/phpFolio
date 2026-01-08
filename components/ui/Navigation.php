<?php
namespace Components;

require_once 'components/BaseComponent.php';

class Navigation extends BaseComponent {
    private array $headerPages = [
        ['name' => 'Home', 'href' => '/'],
        ['name' => 'Writing', 'href' => '/writing', 'inactive' => true,
            'children' => [
                ['name' => 'Samples', 'href' => '/samples'],
                ['name' => 'Quickies', 'href' => '/quickies'],
            ]
        ],
        ['name' => 'Code', 'href' => '/code'],
//        ['name' => 'Art', 'href' => '/art'],
        ['name' => 'Publications', 'href' => '/publications'],
        ['name' => 'About', 'href' => '/about'],
        ['name' => 'Contact', 'href' => '/contact'],
    ];
    
    public static function render(): string {
    }
    
    public function renderSelf(): string {
        return $this->generateNavigation();
    }

    private function generateNavigation(): string {
        $currentPath = $this->prop('currentPath', '/');
        
        ob_start();
        ?>
        <link rel="stylesheet" href="/styles/navigation.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons@latest/iconfont/tabler-icons.min.css">
        <button class="mobile-menu-toggle" aria-label="Toggle menu" aria-controls="main-menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        <ul class="main-menu" id="main-menu" role="menubar">
            <?php foreach ($this->headerPages as $item): ?>
                <?php
                $isInCurrentPath = $this->isInCurrentPath($currentPath, $item['href']);
                $isCurrentPath = $this->isCurrentPath($currentPath, $item['href']);
                $hasChildren = isset($item['children']) && !empty($item['children']);
                ?>
                <li data-key="<?= $this->escape('nav-' . $item['name']) ?>">
                    <a
                        <?php echo array_key_exists('inactive',$item)?'':'href="'.($item['href']).'"'; ?>
                        class="<?= $isInCurrentPath ? 'active' : '' ?>"
                        role="menuitem"
                        aria-label="<?= $hasChildren ? $this->escape($item['name'] . ' (has submenu)') : $this->escape($item['name']) ?>"
                        <?= $hasChildren ? 'aria-haspopup="true"' : '' ?>
                        <?= $isCurrentPath ? 'aria-current="page"' : '' ?>
                    >
                        <?= $this->escape($item['name']) ?>
                        <?php if ($hasChildren): ?>
                            <span class="dropdown-arrow">▼</span>
                        <?php endif; ?>
                    </a>
                    <?php if ($hasChildren): ?>
                        <ul
                            class="submenu"
                            role="menu"
                            aria-label="<?= $this->escape($item['name'] . ' submenu') ?>"
                        >
                            <?php foreach ($item['children'] as $child): ?>
                                <?php
                                $childFullPath = $item['href'] . $child['href'];
                                $isChildInCurrentPath = $this->isInCurrentPath($currentPath, $childFullPath);
                                $isChildCurrentPath = $this->isCurrentPath($currentPath, $childFullPath);
                                ?>
                                <li data-key="<?= $this->escape('nav-' . $child['name']) ?>">
                                    <a 
                                        href="<?= $this->escape($childFullPath) ?>"
                                        class="<?= $isChildInCurrentPath ? 'active' : '' ?>"
                                        role="menuitem"
                                        aria-label="<?= $this->escape($child['name']) ?>"
                                        <?= $isChildCurrentPath ? 'aria-current="page"' : '' ?>
                                    >
                                        <?= $this->escape($child['name']) ?>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
        </ul>

        <script>
            document.querySelector('.mobile-menu-toggle')?.addEventListener('click', () => {
                document.getElementById('main-menu')?.classList.toggle('visible');
            });
        </script>
        <?php
        return ob_get_clean();
    }
    
    private function isInCurrentPath(string $currentPath, string $path): bool {
        return ($currentPath !== $path && strpos($currentPath, $path) === 0 && $path !== '/') || 
               ($currentPath === $path);
    }
    
    private function isCurrentPath(string $currentPath, string $path): bool {
        return $currentPath === $path;
    }
}
?>