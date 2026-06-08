import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

const { query, categoryFilter } = req.body;

try {
let dbQuery = supabase
.from('ai_documents')
.select('*');

```
if (query && query.trim() !== '') {
  dbQuery = dbQuery.or(
    `file_name.ilike.%${query}%,content.ilike.%${query}%`
  );
}

if (
  categoryFilter &&
  categoryFilter !== 'All Files'
) {
  dbQuery = dbQuery.eq('category', categoryFilter);
}

const { data, error } = await dbQuery.limit(50);

if (error) throw error;

return res.status(200).json({
  results: data
});
```

} catch (err) {
return res.status(500).json({
error: err.message
});
}
}
