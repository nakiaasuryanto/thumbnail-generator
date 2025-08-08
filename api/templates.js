import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://db.forgfekdtgwcejthjhcz.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcmdmZWtkdGd3Y2VqdGhqaGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MjY4MDAsImV4cCI6MjA0OTIwMjgwMH0.example';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        switch (req.method) {
            case 'GET':
                if (req.query.id) {
                    // Get single template
                    const { data, error } = await supabase
                        .from('templates')
                        .select('*')
                        .eq('id', req.query.id)
                        .single();
                    
                    if (error) throw error;
                    
                    if (data) {
                        return res.json({ success: true, data });
                    } else {
                        return res.json({ success: false, message: 'Template not found' });
                    }
                } else {
                    // Get all templates
                    const { data, error } = await supabase
                        .from('templates')
                        .select('id, name, created_at')
                        .order('created_at', { ascending: false });
                    
                    if (error) throw error;
                    return res.json({ success: true, data });
                }
                
            case 'POST':
                const { name, frame, canvasWidth = 800, canvasHeight = 600, textFields } = req.body;
                
                if (!name || !frame || !textFields) {
                    return res.json({ success: false, message: 'Missing required fields' });
                }
                
                // Check if template name exists
                const { data: existing } = await supabase
                    .from('templates')
                    .select('id')
                    .eq('name', name)
                    .single();
                
                if (existing) {
                    return res.json({ success: false, message: 'Template name already exists' });
                }
                
                // Insert new template
                const { error: insertError } = await supabase
                    .from('templates')
                    .insert([{
                        name,
                        frame_image: frame,
                        canvas_width: canvasWidth,
                        canvas_height: canvasHeight,
                        text_fields: textFields
                    }]);
                
                if (insertError) throw insertError;
                return res.json({ success: true, message: 'Template saved successfully' });
                
            case 'PUT':
                const { id, name: updateName, frame: updateFrame, canvasWidth: updateWidth = 800, canvasHeight: updateHeight = 600, textFields: updateFields } = req.body;
                
                if (!id || !updateName) {
                    return res.json({ success: false, message: 'Missing required fields' });
                }
                
                // Check if template name exists (excluding current template)
                const { data: existingUpdate } = await supabase
                    .from('templates')
                    .select('id')
                    .eq('name', updateName)
                    .neq('id', id)
                    .single();
                
                if (existingUpdate) {
                    return res.json({ success: false, message: 'Template name already exists' });
                }
                
                // Update template
                const { error: updateError } = await supabase
                    .from('templates')
                    .update({
                        name: updateName,
                        frame_image: updateFrame,
                        canvas_width: updateWidth,
                        canvas_height: updateHeight,
                        text_fields: updateFields,
                        updated_at: new Date()
                    })
                    .eq('id', id);
                
                if (updateError) throw updateError;
                return res.json({ success: true, message: 'Template updated successfully' });
                
            case 'DELETE':
                if (!req.query.id) {
                    return res.json({ success: false, message: 'Template ID required' });
                }
                
                const { error: deleteError } = await supabase
                    .from('templates')
                    .delete()
                    .eq('id', req.query.id);
                
                if (deleteError) throw deleteError;
                return res.json({ success: true, message: 'Template deleted successfully' });
                
            default:
                return res.json({ success: false, message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Server error: ' + error.message 
        });
    }
}