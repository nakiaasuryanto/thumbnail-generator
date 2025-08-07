-- Create database
CREATE DATABASE IF NOT EXISTS thumbnail_generator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE thumbnail_generator;

-- Create templates table
CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    frame_image LONGTEXT NOT NULL,
    canvas_width INT DEFAULT 800,
    canvas_height INT DEFAULT 600,
    text_fields JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_created_at (created_at)
);

-- Insert sample template (optional)
-- INSERT INTO templates (name, frame_image, canvas_width, canvas_height, text_fields) VALUES 
-- ('Sample Template', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 800, 600, '[]');