import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { query, categoryFilter } = req.body;
    try {
        const hfResponse = await fetch('https://huggingface.co', {
            method: 'POST',
            headers: { 'Authorization': Bearer ${process.env.HUGGINGFACE_TOKEN}, 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputs: query })
        });
        const queryEmbedding = await hfResponse.json();
        const { data: results, error } = await supabase.rpc('match_organized_documents', {
            query_embedding: queryEmbedding,
            match_threshold: 0.25,
            match_count: 5,
            filter_category: categoryFilter || ''
        });
        if (error) throw error;
        return res.status(200).json({ results });
    } catch (err) { return res.status(500).json({ error: err.message }); }
}
