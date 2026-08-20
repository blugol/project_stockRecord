const KEY = "stockRecord:trades";

function redisEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    const err = new Error("KV is not connected");
    err.statusCode = 503;
    throw err;
  }
  return { url, token };
}

async function redis(cmd) {
  const { url, token } = redisEnv();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cmd)
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || "KV request failed");
    err.statusCode = 502;
    throw err;
  }
  return data.result;
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  try {
    if (req.method === "GET") {
      const raw = await redis(["GET", KEY]);
      let trades = [];
      if (raw) {
        trades = typeof raw === "string" ? JSON.parse(raw) : raw;
      }
      if (!Array.isArray(trades)) trades = [];
      return res.status(200).json({ trades });
    }
    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const trades = body.trades;
      if (!Array.isArray(trades)) {
        return res.status(400).json({ error: "trades array required" });
      }
      await redis(["SET", KEY, JSON.stringify(trades)]);
      return res.status(200).json({ ok: true });
    }
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "method not allowed" });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || "server error" });
  }
};
