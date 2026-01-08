<?php
// lib/AbstractValidator.php
abstract class AbstractValidator {
    protected $cacheFile;
    protected $contentDir;
    protected $cache;
    protected $needsRefresh = false;
    protected $cacheKeyName; // e.g., 'tools', 'quickies'
    protected $fileExtension = 'md';
    
    public function __construct(string $cacheFile, string $contentDir, string $cacheKeyName) {
        $this->cacheFile = $cacheFile;
        $this->contentDir = rtrim($contentDir, '/') . '/';
        $this->cacheKeyName = $cacheKeyName;
        $this->loadCache();
    }
    
    private function loadCache(): void {
        if (file_exists($this->cacheFile)) {
            $json = file_get_contents($this->cacheFile);
            $this->cache = json_decode($json, true);
            $this->checkCacheValidity();
        } else {
            $this->cache = [
                'last_updated' => '1970-01-01 00:00:00',
                'count' => 0,
                $this->cacheKeyName => []
            ];
            $this->needsRefresh = true;
        }
    }
    
    private function checkCacheValidity(): void {
        $lastUpdated = new DateTime($this->cache['last_updated']);
        $now = new DateTime();
        $actualFiles = glob($this->contentDir . '*.' . $this->fileExtension);
        $actualCount = count($actualFiles);
        
        if      ($lastUpdated->diff($now)->days > 7)            $this->needsRefresh = true;
        else if (count($actualFiles) !== $this->cache['count']) $this->needsRefresh = true;
        else if ($actualCount > 0 && empty($this->cache[$this->cacheKeyName])) $this->needsRefresh = true;
    }
    
    protected function parseFrontmatter(string $file): ?array {
        $content = file_get_contents($file);
        if (substr($content, 0, 3) !== '---') return null;
        $endPos = strpos($content, "\n---", 3);
        if ($endPos === false) return null;
        $frontmatter = substr($content, 3, $endPos - 3);
        require_once 'lib/Spyc.php';
        return Spyc::YAMLLoadString($frontmatter);
    }
    
    protected function saveCache(): void {
        $json = json_encode($this->cache, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($this->cacheFile, $json);
    }
    
    // Abstract methods that concrete classes must implement
    abstract protected function processFile(string $file, string $id, array $metadata): array;
    
    // Public API methods
    public function isValid(string $id): bool {
        $this->refreshCache();
        return isset($this->cache[$this->cacheKeyName][$id]);
    }
    
    public function getItem(string $id): ?array {
        $this->refreshCache();
        return $this->cache[$this->cacheKeyName][$id] ?? null;
    }
    
    public function getAllItems(): array {
        $this->refreshCache();
        return $this->cache[$this->cacheKeyName];
    }
    
    public function getCacheInfo(): array {
        return [
            'last_updated' => $this->cache['last_updated'],
            'count' => $this->cache['count'],
            'needs_refresh' => $this->needsRefresh
        ];
    }
    
    public function refreshCache(): void {
        if (!$this->needsRefresh) return;
        
        $items = [];
        $files = glob($this->contentDir . '*.' . $this->fileExtension);
        
        foreach ($files as $file) {
            $id = basename($file, '.' . $this->fileExtension);
            $metadata = $this->parseFrontmatter($file);
            
            if ($metadata) {
                $items[$id] = $this->processFile($file, $id, $metadata);
            }
        }
        
        $this->cache = [
            'last_updated' => date('Y-m-d H:i:s'),
            'count' => count($items),
            $this->cacheKeyName => $items
        ];
        
        $this->saveCache();
        $this->needsRefresh = false;
    }
}
?>