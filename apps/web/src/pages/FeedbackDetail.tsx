import { useParams } from "react-router-dom";

export function FeedbackDetail() {
  const { id } = useParams();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Feedback detail</h1>
      <div className="rounded-lg border p-4">
        <div className="text-sm text-gray-600">ID</div>
        <div className="font-mono">{id}</div>
      </div>
    </div>
  );
}
