export async function GET() {
  return Response.json({
    ok: true,
    service: "aura-mini",
    time: new Date().toISOString(),
  });
}
