import { trpc } from "../trpc";

export function Home() {
  const health = trpc.health.useQuery();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Feedback Board</h1>

      <div className="rounded-lg border p-4 text-sm">
        <div className=" text-gray-600">API health</div>
        <pre className="">{JSON.stringify(health.data, null, 2)}</pre>
      </div>
    </div>
  );
}
