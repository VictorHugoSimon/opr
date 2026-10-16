export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const notes = req.body?.notes;
    if (!notes || typeof notes !== 'object' || Array.isArray(notes)) {
      return res.status(400).json({ error: 'invalid_notes' });
    }

    const response = await fetch('https://koiniqcwachfdbmlvruj.supabase.co/functions/v1/opr-save-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: process.env.OPR_EDIT_KEY,
        notes
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'save_failed' });
  }
}
