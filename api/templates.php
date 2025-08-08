<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../includes/Database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new Database();

try {
    // Test database connection
    $db->getTemplates();
    
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Get single template
                $template = $db->getTemplate($_GET['id']);
                if ($template) {
                    $template['text_fields'] = json_decode($template['text_fields'], true);
                    echo json_encode(['success' => true, 'data' => $template]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Template not found']);
                }
            } else {
                // Get all templates
                $templates = $db->getTemplates();
                echo json_encode(['success' => true, 'data' => $templates]);
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['name']) || !isset($data['frame']) || !isset($data['textFields'])) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                break;
            }
            
            // Check if template name exists
            if ($db->templateExists($data['name'])) {
                echo json_encode(['success' => false, 'message' => 'Template name already exists']);
                break;
            }
            
            $result = $db->saveTemplate(
                $data['name'],
                $data['frame'],
                $data['canvasWidth'] ?? 800,
                $data['canvasHeight'] ?? 600,
                $data['textFields']
            );
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Template saved successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to save template']);
            }
            break;
            
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id']) || !isset($data['name'])) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields']);
                break;
            }
            
            // Check if template name exists (excluding current template)
            if ($db->templateExists($data['name'], $data['id'])) {
                echo json_encode(['success' => false, 'message' => 'Template name already exists']);
                break;
            }
            
            $result = $db->updateTemplate(
                $data['id'],
                $data['name'],
                $data['frame'],
                $data['canvasWidth'] ?? 800,
                $data['canvasHeight'] ?? 600,
                $data['textFields']
            );
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Template updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update template']);
            }
            break;
            
        case 'DELETE':
            if (!isset($_GET['id'])) {
                echo json_encode(['success' => false, 'message' => 'Template ID required']);
                break;
            }
            
            $result = $db->deleteTemplate($_GET['id']);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Template deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to delete template']);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>