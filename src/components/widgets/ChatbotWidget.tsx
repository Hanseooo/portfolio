import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";


function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="dot h-2 w-2 rounded-full animate-bounce delay-0" />
        <span className="dot h-2 w-2 rounded-full animate-bounce delay-200" />
        <span className="dot h-2 w-2 rounded-full animate-bounce delay-400" />
      </div>
      <style>{`
        .dot { background: rgba(255,255,255,0.9); }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6 }
          40% { transform: translateY(-6px); opacity: 1 }
        }
        .animate-bounce { animation: bounce 1s infinite; }
        .delay-0 { animation-delay: 0s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}

function fmtTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}> 
      <div className={`max-w-[70%] ${isUser ? "bg-white/90 text-gray-900" : "bg-emerald-700/90 text-foreground"} p-3 rounded-2xl shadow-sm backdrop-blur-lg`}> 
        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
        <div className="text-xs mt-2 opacity-60 text-right">{fmtTime(msg.timestamp)}</div>
      </div>
    </div>
  );
}

function MessageList({ messages, loading }: { messages: ChatMessage[]; loading: boolean }) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 min-h-64 chatbot-widget overflow-auto p-4 space-y-2">
      {messages.map((m, i) => (
        <MessageBubble key={i} msg={m} />
      ))}

      {loading && (
        <div className="flex justify-start mb-2">
          <div className="bg-emerald-700/90 text-white p-3 rounded-2xl shadow-sm backdrop-blur-lg">
            <TypingIndicator />
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}

function ChatInput({ onSend, isLoading }: { onSend: (t: string) => Promise<void>; isLoading: boolean }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  async function submit() {
    if (!text.trim()) return;
    const t = text.trim();
    setText("");
    await onSend(t);
  }

  return (
    <div className="p-4 flex items-center border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex h-12 items-center gap-3">
            <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={1}
            className="
                resize-none max-h-32 w-58
                bg-white/10 text-white placeholder-white/60 
                rounded-xl border border-white/10
                p-3 shadow-inner
                focus-visible:ring-2 focus-visible:ring-emerald-400/40
            "
            placeholder="Ask about the site or navigation..."
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
                }
            }}
            />

            <Button
            onClick={submit}
            disabled={isLoading}
            className="
                shrink-0 h-11 px-6 rounded-xl
                bg-emerald-600 hover:bg-emerald-500 
                text-white font-medium
            "
            >
            {isLoading ? "Sending..." : "Send"}
            </Button>
        </div>
    </div>

  );
}


import { useChatbot } from "@/hooks/useChatbot"; // your hook
import { handleNavigation } from "@/utils/navigationHandler"; // your navigation util
import { useChatStore } from "@/store/chatStore";
import { type ChatMessage } from "@/hooks/useChatbot";
import { Rocket } from "lucide-react";

export default function ChatbotWidget() {
  const navigate = useNavigate();
  const [, sendMessage, isLoading] = useChatbot();

  // CHAT STORE state
  const addMessage = useChatStore((s) => s.addMessage);
  const setNavigation = useChatStore((s) => s.setNavigation);
  const isOpen = useChatStore((s) => s.isOpen);
  const setOpen = useChatStore((s) => s.setOpen);


  async function handleSend(userText: string) {
    addMessage({ role: "user", content: userText, timestamp: new Date().toISOString(), source: "local" });

    const parsed = await sendMessage(userText);

    if (!parsed) return;

    addMessage({
        role: "assistant",
        content: parsed.message || "",
        timestamp: new Date().toISOString(),
        source: "api",
    });

    if (parsed?.type === "navigate") {
      setNavigation(parsed.navigation ?? null);
      if (parsed.navigation) {
        handleNavigation(parsed.navigation, navigate);
      }
    }

  }

    const storeMessages = useChatStore((s) => s.messages);
    const renderedMessages = useMemo(
    () => storeMessages.filter((m) => m.role !== "system"),
    [storeMessages]
    );




  return (
    <>
      <div className="fixed bottom-6 sm:bottom-8 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Rocket Chat"
          className="w-10 h-10 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 focus:outline-none"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))" }}
        >
          <Avatar className="w-8 h-8">
            <Rocket className="select-none m-auto" />
          </Avatar>
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => setOpen(open)}>
        <DialogContent className="w-[360px] max-w-[95vw] h-[560px] p-0 overflow-hidden bg-clip-padding bg-white/5 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/6">
            <Avatar>
              <AvatarImage src="botAvatar/rocketBot.png" alt="Rocket" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold text-white">Rocket — Portfolio Assistant</div>
              <div className="text-xs text-white/70">Ask me about the site or owner</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
            </div>
          </div>

          {/* Messages */}
          <MessageList messages={renderedMessages} loading={isLoading} />

          {/* Input */}
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </DialogContent>
      </Dialog>

      <style>{`
        .bg-emerald-700/90 { background-color: rgba(16,185,129,0.9); }
        .chatbot-widget {
        -ms-overflow-style: none;  
        scrollbar-width: none;  
        overflow-y: auto; 
        }

        .chatbot-widget::-webkit-scrollbar {
        display: none;
        }
      `}</style>
    </>
  );
}
