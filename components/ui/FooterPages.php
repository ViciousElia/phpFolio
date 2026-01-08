<?php
namespace Components;

require_once 'components/BaseComponent.php';

class FooterPages extends BaseComponent {
    private array $footerPages = [
        ['name' => 'Onsite Navigation',
            'children' => [
                ['name' => 'About', 'href' => '/about'],
                ['name' => 'Quickies', 'href' => '/writing/quickies'],
                ['name' => 'Samples', 'href' => '/writing/samples'],
                ['name' => 'Contact', 'href' => '/contact'],
            ]
        ],
        ['name' => 'Sites I Love',
            'children' => [
                ['name' => 'Birbles Art', 'href' => 'https://birbles.com/', 'icon'=>'/public/vectors/birbles.svg'],
                ['name' => 'Questionable Content', 'href' => 'https://questionablecontent.net/', 'icon'=>'/public/vectors/qc.svg'],
                ['name' => 'XKCD', 'href' => 'https://xkcd.com/', 'icon'=>'/public/vectors/xkcd.svg'],
            ]
        ],
        ['name' => 'Important Stuff',
            'children' => [
                ['name' => 'A Tale of Thorns', 'href' => 'https://rose.fruitfolio.com/', 'icon'=>'/public/vectors/rose.svg'],
                ['name' => 'Forays (perpetual construction)', 'href' => 'https://forays.fruitfolio.com/', 'icon'=>'/public/rasters/g4.png'],
                ['name' => 'Sitemap', 'href' => '/sitemap.xml'],
                [],
                ['name' => 'terra@fruitfolio.com', 'href' => 'mailto:terra@fruitfolio.com'],
            ]
        ],
    ];

    public static function render(): string {
        // Create instance to access instance methods
        $instance = new static();
        return $instance->generateNavigation();
    }

    private function generateNavigation(): string {
        ob_start();
        ?>
        <div class="foot-links">
            <?php foreach($this->footerPages as $group){
                echo '<div><h4>'.($group['name']).'</h4><hr />';
                foreach($group['children'] as $link){
                    if (count($link)==0) echo '<hr />';
                    else{
                        echo '<a href="'.($link['href']).'">';
                        if (array_key_exists('icon',$link)){
                            echo '<img width="24" height="24" src="'.($link['icon']).'" /> ';
                        }
                        echo $link['name'].'</a>';
                    }
                }
                echo '</div>';
            }
            ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
?>