export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { status: 405, code: 'METHOD_NOT_ALLOWED', message: 'POST required' } });
  }

  const baseUrl = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://sadflower-server-3c85453c8087.herokuapp.com';
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/my-work/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers['idempotency-key'] ? { 'Idempotency-Key': req.headers['idempotency-key'] } : {}),
      },
      body: JSON.stringify(req.body || {}),
    });
    const body = await response.json();
    return res.status(response.status).json(body);
  } catch {
    return res.status(503).json({ error: { status: 503, code: 'API_UNAVAILABLE', message: 'MyWork service unavailable' } });
  }
}
