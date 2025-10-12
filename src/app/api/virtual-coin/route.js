// Simulated coin API: returns current price and a small history
export async function GET() {
  // simple deterministic pseudo-random price series for demo
  const symbol = 'RNDCOIN';
  const now = Date.now();
  // generate 30 days price history
  const history = [];
  let base = 100; // base price 100 Rs
  for (let i = 29; i >= 0; i--) {
    const t = new Date(now - i * 24 * 3600 * 1000);
    // simple sine + noise
    const price = +(base + Math.sin((now / 1e9) + i) * 5 + (Math.random() - 0.5) * 2).toFixed(2);
    history.push({ date: t.toISOString().slice(0, 10), price });
  }

  const current = history[history.length - 1].price;

  return new Response(JSON.stringify({ symbol, current, history }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
