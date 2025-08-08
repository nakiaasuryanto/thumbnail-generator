import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = 'https://forgfekdtgwcejthjhcz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvcmdmZWtkdGd3Y2VqdGhqaGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTk3NjUsImV4cCI6MjA3MDE5NTc2NX0.-GrttEsBJYpl6_CVE8zTtNuTKFsr5YjzVwEhTCd5j4w';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        // Get the base64 image data
        const { image, fileName: originalFileName } = req.body;
        
        if (!image) {
            return res.status(400).json({ success: false, error: 'No image provided' });
        }

        // Convert base64 to buffer
        const base64Data = image.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Generate unique filename
        const fileName = `templates/${uuidv4()}.png`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, buffer, {
                contentType: 'image/png',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);

        return res.json({ 
            success: true, 
            url: urlData.publicUrl,
            path: fileName 
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Server error: ' + error.message 
        });
    }
}