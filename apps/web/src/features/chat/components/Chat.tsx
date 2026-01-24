import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";

import { formatDateTime } from "../../../utils/formatDateTime";
import { postChat } from "../lib/chatApi";
import type { Msg } from "../lib/types";
import { ToolTracePanel } from "./ToolTracePanel";
import type { ChatContext, ToolTrace } from "@einari/api-contract";
import { useSearchParams } from "react-router-dom";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function makeAssistant(text: string, data?: ToolTrace[]): Msg {
  return { id: uid(), role: "assistant", text, data, createdAt: new Date() };
}

function makeUser(text: string): Msg {
  return { id: uid(), role: "user", text, createdAt: new Date() };
}

const LAD_QUICK_ACTIONS = [
  {
    key: "lad_summary",
    label: "Summarise (facts)",
    text: "Summarise this district with official name, dates (if present), area (km²), and bbox. Use lad_by_ref.",
  },
  {
    key: "lad_size",
    label: "How big is it?",
    text: "How large is this district? Use lad_by_ref and report areaKm2.",
  },
  {
    key: "lad_bbox",
    label: "Bounding box",
    text: "What is the bounding box for this district? Use lad_by_ref and return min/max lon/lat.",
  },
  {
    key: "lad_wired_in",
    label: "What data is wired in?",
    text: "What LAD data is available in this demo, and what isn't wired in yet?",
  },
] as const;

const GENERIC_QUICK_ACTIONS = [
  { key: "recent", label: "recent", text: "recent" },
  { key: "open", label: "open", text: "open" },
  { key: "stats", label: "stats", text: "stats" },
] as const;

function initialAssistantForContext(context: ChatContext): Msg[] {
  if (context.type === "lad") {
    const label = context.uiLabel ?? "Selected district (UI label)";
    return [
      makeAssistant(
        `You’re looking at ${label}.\n` +
          `Reference (authoritative): ${context.ref}\n\n` +
          `Try one of these:\n` +
          `• “Summarise this district (facts)”\n` +
          `• “How big is it?”\n` +
          `• “What data is wired in?”\n`,
      ),
    ];
  }

  return [makeAssistant('Try: "recent", "open", "stats", "search navigation", or "get <id>".')];
}

export function Chat() {
  const [searchParams] = useSearchParams();

  const ref = searchParams.get("ref") ?? "";
  const uiLabel = searchParams.get("district") ?? undefined;

  const context: ChatContext = useMemo(() => {
    if (ref) {
      return {
        type: "lad",
        ref,
        uiLabel: uiLabel || undefined,
      };
    }
    return { type: "none" };
  }, [ref, uiLabel]);

  const [messages, setMessages] = useState<Msg[]>(() => initialAssistantForContext(context));

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const quickActions = useMemo(() => {
    return context.type === "lad" ? LAD_QUICK_ACTIONS : GENERIC_QUICK_ACTIONS;
  }, [context.type]);

  useEffect(() => {
    setMessages(initialAssistantForContext(context));
    setError(null);
    setInput("");
  }, [context.type, context.type === "lad" ? context.ref : "none"]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isSending]);

  async function send(raw: string) {
    const message = raw.trim();
    if (!message || isSending) return;

    setError(null);
    setIsSending(true);

    setMessages((m) => [...m, makeUser(message)]);
    setInput("");

    try {
      const { reply, data } = await postChat({ message, context });
      setMessages((m) => [...m, makeAssistant(reply, data)]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Network error";
      setError(msg);
      setMessages((m) => [...m, makeAssistant(`Sorry — ${msg}`)]);
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

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-2">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-200">Chat</div>
        <div className="text-xs text-slate-400">{messages.length} messages</div>
      </div>

      {context.type === "lad" ? (
        <div className="mt-2 px-4 text-xs text-slate-600">
          Context: <span className="font-medium">{context.uiLabel ?? "Selected district"}</span>{" "}
          <span className="text-slate-400">• Ref: {context.ref}</span>
        </div>
      ) : null}

      <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <button
              key={a.key}
              type="button"
              disabled={isSending}
              onClick={() => void send(a.text)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              title={a.text}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[420px] overflow-y-auto">
        <ul className="divide-y divide-slate-100">
          {messages.map((m) => (
            <li key={m.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {m.role === "assistant" ? (
                      <div className="truncate text-sm font-semibold text-brand-500">Assistant</div>
                    ) : (
                      <div className="truncate text-sm font-semibold text-slate-900">You</div>
                    )}

                    {isSending && m.role === "assistant" ? (
                      <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-xs font-medium text-brand-200 ring-1 ring-white/10">
                        Thinking…
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{m.text}</p>

                  {Array.isArray(m.data) && m.data.length ? (
                    <div className="mt-3 space-y-3">
                      {m.data.map((t, idx) => (
                        <ToolTracePanel
                          key={`${t.name}-${idx}`}
                          trace={t}
                          open={true}
                          onGet={(id) => void send(`get ${id}`)}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="shrink-0 text-xs text-slate-500">{formatDateTime(m.createdAt)}</div>
              </div>
            </li>
          ))}
        </ul>

        <div ref={bottomRef} />
      </div>

      {error ? <div className="border-t border-slate-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={context.type === "lad" ? "Ask about this district…" : "Ask something…"}
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
