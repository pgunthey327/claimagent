export async function processClaim(text) {
  const res = await fetch("http://localhost:3001/api/process-claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
