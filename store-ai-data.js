import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { text, file_name, category, summary } = req.body;
    try {
        const hfResponse = await fetch('https://huggingface.co', {
            method: 'POST',
            headers: { 'Authorization': Bearer ${process.env.HUGGINGFACE_TOKEN}, 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputs: text })
        });
        const embedding = await hfResponse.json();
        const { error } = await supabase.from('ai_documents').insert([{ content: text, file_name, category, summary, embedding }]);
        if (error) throw error;
        return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ error: err.message }); }
}
