import { Chat } from "../components/Chat";

export function ChatPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Chat</h1>
        <p className="text-sm text-slate-600">
          Ask questions about feedback items. Read-only assistant.
        </p>
      </header>

      <Chat />
    </div>
  );
}
