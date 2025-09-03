const PORT = Number(process.env.PORT || 3000);

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/payments") {
      return new Response(null, { status: 200 });
    }
    if (req.method === "GET" && url.pathname === "/payments-summary") {
      return json({ default: { totalRequests: 0, totalAmount: 0 }, fallback: { totalRequests: 0, totalAmount: 0 } });
    }
    if (req.method === "POST" && url.pathname === "/purge-payments") {
      return json({ result: "ok" });
    }

    return new Response("not found", { status: 404 });
  },
});

console.log(`API listening on :${PORT}`);
