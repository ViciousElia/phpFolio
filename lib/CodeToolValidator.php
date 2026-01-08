<?php
// CodeToolValidator.php
require_once 'lib/AbstractValidator.php';

class CodeToolValidator extends AbstractValidator {
    public function __construct() {
        parent::__construct('data/code-tools.json', 'content/code/', 'tools');
    }
    
    protected function processFile(string $file, string $slug, array $metadata): array {
        return [
            'slug' => $slug,
            'name' => $metadata['name'] ?? 'Unnamed Tool',
            'summary' => $metadata['summary'] ?? '',
            'icon' => $metadata['icon'] ?? '',
            'file_path' => $file,
            'last_modified' => filemtime($file)
        ];
    }
}
?>