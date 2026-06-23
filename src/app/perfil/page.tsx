"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Calendar, Package, Clock, CheckCircle, XCircle, LogOut, MessageCircle } from "lucide-react";
import { store } from "@/data/store";
import { Order, OrderStatus } from "@/types";
import Link from "next/link";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  pending: { label: "Pendente", icon: Clock, color: "text-komaniya-gold", bg: "bg-komaniya-gold/10" },
  in_progress: { label: "Em Andamento", icon: Package, color: "text-komaniya-medium", bg: "bg-komaniya-medium/10" },
  completed: { label: "Concluído", icon: CheckCircle, color: "text-komaniya-green", bg: "bg-komaniya-green/10" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-komaniya-danger", bg: "bg-komaniya-danger/10" },
};

export default function PerfilPage() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      store.getOrdersByUser(user.id).then(setOrders);
    }
  }, [user]);

  if (loading || !isAuthenticated || !user) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-komaniya-text-bright mb-8">Meu Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-komaniya-card card-border rounded-2xl p-6">
              <div className="text-center mb-6">
                {user.discordAvatar ? (
                  <img src={user.discordAvatar} alt="" className="w-20 h-20 mx-auto rounded-full mb-3" />
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-full gradient-green flex items-center justify-center text-komaniya-darker text-2xl font-bold mb-3">{user.avatar}</div>
                )}
                <h2 className="text-xl font-bold text-komaniya-text-bright">{user.name}</h2>
                {user.discordUsername && (
                  <p className="text-xs text-komaniya-text-dim mt-1">@{user.discordUsername}</p>
                )}
                {user.role === "admin" && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-komaniya-gold/10 text-komaniya-gold text-xs font-medium">Administrador</span>}
                {user.role === "employee" && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-komaniya-medium/10 text-komaniya-medium text-xs font-medium">Funcionário</span>}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-komaniya-text-dim" /><span className="text-komaniya-text">{user.email}</span></div>
                <div className="flex items-center gap-3 text-sm"><Calendar className="w-4 h-4 text-komaniya-text-dim" /><span className="text-komaniya-text">Membro desde {user.createdAt}</span></div>
              </div>
              <button onClick={() => { logout(); router.push("/"); }} className="mt-6 w-full btn-secondary flex items-center justify-center gap-2 text-sm !border-komaniya-danger/50 !text-komaniya-danger hover:!bg-komaniya-danger/10">
                <LogOut className="w-4 h-4" /> Sair da Conta
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-komaniya-card card-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-komaniya-text-bright mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-komaniya-gold" /> Histórico de Pedidos
              </h3>

              {orders.length === 0 ? (
                <p className="text-sm text-komaniya-text-dim text-center py-8">Nenhum pedido encontrado.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const status = statusConfig[order.status];
                    return (
                      <div key={order.id} className="bg-komaniya-cream rounded-xl p-4 border border-komaniya-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono text-komaniya-text-dim">{order.id}</span>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            <status.icon className="w-3 h-3" /> {status.label}
                          </div>
                        </div>
                        <div className="text-sm text-komaniya-text-bright font-medium">
                          {order.items.map((i) => i.productName).join(", ")}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-komaniya-border/30">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-komaniya-text-dim">{order.createdAt}</span>
                            {order.employeeName && (
                              <span className="text-xs text-komaniya-medium">· {order.employeeName}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-komaniya-gold">R$ {order.totalPrice.toFixed(2)}</span>
                            {(order.status === "in_progress" || order.status === "pending") && (
                              <Link
                                href={`/pedidos?id=${order.id}`}
                                className="p-1.5 rounded-lg bg-komaniya-green/10 text-komaniya-medium hover:bg-komaniya-green/20 transition-colors"
                                title="Abrir chat"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
