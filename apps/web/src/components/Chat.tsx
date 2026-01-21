import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";

import { StatusPill } from "./StatusPill";
import { formatDateTime } from "../utils/formatDateTime";

type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  data?: any;
  createdAt: Date;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function Chat() {
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: uid(),
      role: "assistant",
      text: 'Try: "recent", "open", "stats", "search navigation", or "get <id>".',
      createdAt: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const quickActions = useMemo(
    () => ["recent", "open", "stats", "search keyboard", "search navigation"],
    [],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isSending]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || isSending) return;

    setError(null);
    setIsSending(true);

    const userMsg: Msg = {
      id: uid(),
      role: "user",
      text: message,
      createdAt: new Date(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg = payload?.error ?? `Request failed (${res.status})`;
        setError(errMsg);
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "assistant",
            text: `Sorry — ${errMsg}`,
            createdAt: new Date(),
          },
        ]);
        return;
      }

      const assistantMsg: Msg = {
        id: uid(),
        role: "assistant",
        text: payload?.reply ?? "OK",
        data: payload?.data,
        createdAt: new Date(),
      };

      setMessages((m) => [...m, assistantMsg]);
    } catch (e: any) {
      const msg = e?.message ?? "Network error";
      setError(msg);
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          text: `Sorry — ${msg}`,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  function renderToolData(data: any) {
    if (!data || !Array.isArray(data.items)) return null;

    return (
      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Results
          </div>
          <div className="text-xs text-slate-500">
            {data.items.length} items
          </div>
        </div>

        <ul className="divide-y divide-slate-200">
          {data.items.map((it: any) => (
            <li key={it.id} className="px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {it.summary}
                    </div>
                    {it.status ? <StatusPill status={it.status} /> : null}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <code className="text-xs text-slate-600">{it.id}</code>

                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(String(it.id))
                      }
                      className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      Copy ID
                    </button>

                    <button
                      type="button"
                      onClick={() => void send(`get ${it.id}`)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      Get
                    </button>
                  </div>
                </div>

                <div className="shrink-0 text-xs text-slate-500">
                  {it.createdAt ? formatDateTime(new Date(it.createdAt)) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header strip */}
      <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-2">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-200">
          Chat
        </div>
        <div className="text-xs text-slate-400">{messages.length} messages</div>
      </div>

      {/* Quick actions */}
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <button
              key={a}
              type="button"
              disabled={isSending}
              onClick={() => void send(a)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="h-[420px] overflow-y-auto">
        <ul className="divide-y divide-slate-100">
          {messages.map((m) => (
            <li key={m.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {m.role === "assistant" ? (
                      <div className="truncate text-sm font-semibold text-brand-500">
                        Assistant
                      </div>
                    ) : (
                      <div className="truncate text-sm font-semibold text-slate-900">
                        You
                      </div>
                    )}

                    {isSending && m.role === "assistant" ? (
                      <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-xs font-medium text-brand-200 ring-1 ring-white/10">
                        Thinking…
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {m.text}
                  </p>

                  {Array.isArray(m.data) ? (
                    <div className="mt-3 space-y-3">
                      {m.data.map((t: any, idx: number) => (
                        <details
                          key={`${t.name}-${idx}`}
                          className="rounded-lg border border-slate-200 bg-slate-50"
                          open={true}
                        >
                          <summary className="cursor-pointer select-none px-3 py-2 text-xs font-medium text-slate-700">
                            Tool: <span className="font-mono">{t.name}</span>
                          </summary>
                          <div className="px-3 pb-3">
                            {t?.output ? renderToolData(t.output) : null}
                            <details className="mt-3">
                              <summary className="cursor-pointer select-none text-xs font-medium text-slate-600 hover:text-slate-800">
                                Raw tool trace
                              </summary>
                              <pre className="mt-2 overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800">
                                {JSON.stringify(t, null, 2)}
                              </pre>
                            </details>
                          </div>
                        </details>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="shrink-0 text-xs text-slate-500">
                  {formatDateTime(m.createdAt)}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {error ? (
        <div className="border-t border-slate-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* Input */}
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask something…"
          rows={2}
          disabled={isSending}
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
        />

        <button
          type="button"
          onClick={() => void send(input)}
          disabled={isSending || !input.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
        >
          <SendHorizonal className="h-4 w-4 text-slate-300" />
          Send
        </button>
      </div>
    </section>
  );
}
