const UA = "Mozilla/5.0 (compatible; stockRecord/1.0)";

function parseIndex(data) {
  const ratio = Number(String(data.fluctuationsRatio || "0").replace(/,/g, ""));
  return {
    code: data.itemCode,
    price: data.closePrice,
    change: data.compareToPreviousClosePrice,
    ratio: data.fluctuationsRatio,
    up: ratio > 0,
    status: data.marketStatus === "OPEN" ? "장중" : "마감",
    at: data.localTradedAt || ""
  };
}

async function fetchIndex(code) {
  const res = await fetch("https://m.stock.naver.com/api/index/" + code + "/basic", {
    headers: { "User-Agent": UA, Accept: "application/json" }
  });
  if (!res.ok) throw new Error(code + " " + res.status);
  return parseIndex(await res.json());
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method not allowed" });
  }
  try {
    const [kospi, kosdaq] = await Promise.all([fetchIndex("KOSPI"), fetchIndex("KOSDAQ")]);
    return res.status(200).json({ kospi, kosdaq });
  } catch (err) {
    return res.status(502).json({ error: err.message || "시세를 가져오지 못했습니다" });
  }
};
