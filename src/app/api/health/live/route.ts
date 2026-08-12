export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "nocscheduler",
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
