const STRAPI_API_URL =
  process.env.STRAPI_API_URL ||
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://sadflower-server-3c85453c8087.herokuapp.com";

const STRAPI_API_TOKEN =
  process.env.STRAPI_KEY || process.env.REACT_APP_STRAPI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const query = new URLSearchParams();

  Object.entries(req.query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      return;
    }

    if (value !== undefined) {
      query.append(key, value);
    }
  });

  if (!query.has("populate")) {
    query.set("populate", "*");
  }

  const headers = {};
  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  try {
    const response = await fetch(`${STRAPI_API_URL}/api/blogs?${query}`, {
      headers,
    });
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Failed to fetch blogs from Strapi:", error);
    return res.status(502).json({ error: "Failed to fetch blogs" });
  }
}
