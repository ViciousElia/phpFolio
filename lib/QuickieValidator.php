<?php
// QuickieValidator.php
require_once 'AbstractValidator.php';

class QuickieValidator extends AbstractValidator {
    public function __construct() {
        parent::__construct('data/quickies.json', 'content/quickies/', 'quickies');
    }
    
    protected function processFile(string $file, string $id, array $metadata): array {
        return [
            'id' => $id,
            'title' => $metadata['title'] ?? 'Untitled',
            'summary' => $metadata['summary'] ?? '',
            'file_path' => $file,
            'last_modified' => filemtime($file),
            'tags' => $metadata['tags'] ?? []
        ];
    }    
}
?>