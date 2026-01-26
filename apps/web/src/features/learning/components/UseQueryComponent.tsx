import { useQuery } from "@tanstack/react-query";

export function UseQueryComponent() {
  const query = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 1000));
      return "Hello world";
    },
    staleTime: 500,
    retry: 3
  });

  return (
    <div className="space-y-6 border-spacing-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>UseQueryComponent</div>
      <div>{query.isLoading ? "Loading..." : ""}</div>
      <div>Query Status: {query.status}</div>
      <div>Data: {query.data}</div>
    </div>
  );
}
