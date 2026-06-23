"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Image as ImageIcon, Check, CheckCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { store } from "@/data/store";
import { Message } from "@/types";
import { getSupabase } from "@/lib/supabase";

interface ChatProps {
  orderId: string;
}

export default function Chat({ orderId }: ChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const msgs = await store.getMessages(orderId);
      if (!cancelled) {
        setMessages(msgs);
        setTimeout(scrollToBottom, 100);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [orderId, scrollToBottom]);

  useEffect(() => {
    if (!user) return;
    store.markMessagesAsRead(orderId, user.id);
  }, [orderId, user, messages.length]);

  useEffect(() => {
    const sb = getSupabase();
    const channel = sb
      .channel(`messages:${orderId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `order_id=eq.${orderId}` },
        (payload) => {
          const m = payload.new;
          const newMsg: Message = {
            id: m.id,
            orderId: m.order_id,
            senderId: m.sender_id,
            senderName: m.sender_name,
            senderRole: m.sender_role,
            content: m.content,
            imageUrl: m.image_url,
            readBy: m.read_by || [],
            createdAt: m.created_at,
          };
          setMessages((prev) => {
            if (prev.some((p) => p.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          if (user && m.sender_id !== user.id) {
            store.markMessagesAsRead(orderId, user.id);
          }
        }
      )
      .subscribe();

    return () => {
      sb.removeChannel(channel);
    };
  }, [orderId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!user || !newMessage.trim() || sending) return;
    setSending(true);
    const msg = await store.sendMessage(orderId, user.id, user.name, user.role, newMessage.trim());
    if (msg) {
      setNewMessage("");
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const url = await store.uploadImage(file);
    if (url) {
      await store.sendMessage(orderId, user.id, user.name, user.role, "[Imagem]", url);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isOwnMessage = (msg: Message) => msg.senderId === user?.id;
  const isRead = (msg: Message) => msg.readBy.length > 1;

  const roleColors: Record<string, string> = {
    admin: "text-komaniya-gold",
    employee: "text-komaniya-medium",
    client: "text-komaniya-text-dim",
  };

  const roleLabels: Record<string, string> = {
    admin: "Admin",
    employee: "Funcionário",
    client: "Cliente",
  };

  return (
    <div className="flex flex-col h-full bg-komaniya-card rounded-xl border border-komaniya-border overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-komaniya-text-dim">Nenhuma mensagem ainda. Inicie a conversa!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${isOwnMessage(msg) ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] ${isOwnMessage(msg) ? "order-2" : "order-1"}`}>
              {!isOwnMessage(msg) && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-komaniya-text-bright">{msg.senderName}</span>
                  <span className={`text-[10px] font-medium ${roleColors[msg.senderRole] || "text-komaniya-text-dim"}`}>
                    {roleLabels[msg.senderRole] || msg.senderRole}
                  </span>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 ${
                  isOwnMessage(msg)
                    ? "bg-komaniya-green text-komaniya-darker rounded-br-md"
                    : "bg-komaniya-cream text-komaniya-text rounded-bl-md"
                }`}
              >
                {msg.imageUrl && (
                  <div className="mb-2">
                    <img src={msg.imageUrl} alt="Imagem" className="rounded-lg max-w-full max-h-48 object-cover" />
                  </div>
                )}
                {msg.content && msg.content !== "[Imagem]" && (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
                {msg.content === "[Imagem]" && !msg.imageUrl && (
                  <p className="text-sm opacity-60 italic">[Imagem]</p>
                )}
                <div className={`flex items-center gap-1 mt-1 ${isOwnMessage(msg) ? "justify-end" : "justify-start"}`}>
                  <span className={`text-[10px] ${isOwnMessage(msg) ? "text-komaniya-darker/60" : "text-komaniya-text-dim"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {isOwnMessage(msg) && (
                    isRead(msg)
                      ? <CheckCheck className="w-3 h-3 text-komaniya-darker/60" />
                      : <Check className="w-3 h-3 text-komaniya-darker/40" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-komaniya-border p-3 bg-komaniya-cream/50">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-2 rounded-lg hover:bg-komaniya-border/50 transition-colors disabled:opacity-50"
            title="Enviar imagem"
          >
            <ImageIcon className="w-5 h-5 text-komaniya-text-dim" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={uploading ? "Enviando imagem..." : "Digite sua mensagem..."}
            disabled={uploading}
            className="flex-1 input-field !py-2 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending || uploading}
            className="p-2 rounded-lg bg-komaniya-green text-komaniya-darker hover:bg-komaniya-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
