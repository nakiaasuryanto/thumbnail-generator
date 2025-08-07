<?php
class Database {
    private $pdo;
    
    public function __construct() {
        require_once __DIR__ . '/../config/database.php';
        $this->pdo = $pdo;
    }
    
    // Get all templates
    public function getTemplates() {
        $stmt = $this->pdo->query("SELECT id, name, created_at FROM templates ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }
    
    // Get single template by ID
    public function getTemplate($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM templates WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    // Save template
    public function saveTemplate($name, $frame, $canvas_width, $canvas_height, $text_fields) {
        $stmt = $this->pdo->prepare("
            INSERT INTO templates (name, frame_image, canvas_width, canvas_height, text_fields, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        
        return $stmt->execute([
            $name,
            $frame,
            $canvas_width,
            $canvas_height,
            json_encode($text_fields)
        ]);
    }
    
    // Update template
    public function updateTemplate($id, $name, $frame, $canvas_width, $canvas_height, $text_fields) {
        $stmt = $this->pdo->prepare("
            UPDATE templates 
            SET name = ?, frame_image = ?, canvas_width = ?, canvas_height = ?, text_fields = ?, updated_at = NOW()
            WHERE id = ?
        ");
        
        return $stmt->execute([
            $name,
            $frame,
            $canvas_width,
            $canvas_height,
            json_encode($text_fields),
            $id
        ]);
    }
    
    // Delete template
    public function deleteTemplate($id) {
        $stmt = $this->pdo->prepare("DELETE FROM templates WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    // Check if template name exists
    public function templateExists($name, $excludeId = null) {
        if ($excludeId) {
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM templates WHERE name = ? AND id != ?");
            $stmt->execute([$name, $excludeId]);
        } else {
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM templates WHERE name = ?");
            $stmt->execute([$name]);
        }
        
        return $stmt->fetchColumn() > 0;
    }
}
?>