"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { store } from "@/data/store";
import { Order, OrderStatus, OrderPriority } from "@/types";
import Chat from "@/components/Chat";
import {
  ArrowLeft, Package, Clock, CheckCircle, XCircle, AlertCircle,
  User, DollarSign, Calendar,
} from "lucide-react";
import Link from "next/link";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  pending: { label: "Pendente", icon: Clock, color: "text-komaniya-gold", bg: "bg-komaniya-gold/10" },
  in_progress: { label: "Em Andamento", icon: Package, color: "text-komaniya-medium", bg: "bg-komaniya-medium/10" },
  completed: { label: "Concluído", icon: CheckCircle, color: "text-komaniya-green", bg: "bg-komaniya-green/10" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-komaniya-danger", bg: "bg-komaniya-danger/10" },
};

const priorityConfig: Record<OrderPriority, { label: string; color: string; bg: string }> = {
  low: { label: "Baixa", color: "text-komaniya-text-dim", bg: "bg-komaniya-cream" },
  normal: { label: "Normal", color: "text-komaniya-medium", bg: "bg-komaniya-medium/10" },
  high: { label: "Alta", color: "text-komaniya-gold", bg: "bg-komaniya-gold/10" },
  urgent: { label: "Urgente", color: "text-komaniya-danger", bg: "bg-komaniya-danger/10" },
};

function PedidoContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!user || !orderId) return;
    const loadOrder = async () => {
      let orders: Order[] = [];
      if (user.role === "admin") {
        orders = await store.getAllOrders();
      } else if (user.role === "employee") {
        orders = await store.getOrdersByEmployee(user.id);
      } else {
        orders = await store.getOrdersByUser(user.id);
      }
      const found = orders.find((o) => o.id === orderId);
      setOrder(found || null);
      setLoadingOrder(false);
    };
    loadOrder();
  }, [user, orderId]);

  if (loading || !isAuthenticated || loadingOrder) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 border-4 border-komaniya-green border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (!orderId) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-komaniya-text-dim mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-komaniya-text-bright mb-2">Nenhum pedido selecionado</h1>
          <p className="text-komaniya-text-dim mb-6">Acesse um pedido pelo perfil ou pela lista de pedidos.</p>
          <Link href="/perfil" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Ver Meus Pedidos
          </Link>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="w-12 h-12 text-komaniya-text-dim mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-komaniya-text-bright mb-2">Pedido não encontrado</h1>
          <p className="text-komaniya-text-dim mb-6">Você não tem acesso a este pedido.</p>
          <Link href="/perfil" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>
      </section>
    );
  }

  const status = statusConfig[order.status];
  const priority = priorityConfig[order.priority];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/perfil" className="inline-flex items-center gap-2 text-sm text-komaniya-text-dim hover:text-komaniya-medium transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar aos pedidos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-komaniya-card card-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono text-komaniya-text-dim">{order.id}</span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                  <status.icon className="w-3 h-3" /> {status.label}
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                  {priority.label}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-komaniya-text-dim" />
                  <span className="text-komaniya-text">{order.userName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-komaniya-text-dim" />
                  <span className="text-komaniya-gold font-bold">R$ {order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-komaniya-text-dim" />
                  <span className="text-komaniya-text-dim">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
                {order.employeeName && (
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-komaniya-text-dim" />
                    <span className="text-komaniya-text">{order.employeeName}</span>
                  </div>
                )}
              </div>

              {order.description && (
                <div className="mt-4 pt-4 border-t border-komaniya-border">
                  <p className="text-xs font-medium text-komaniya-text-dim mb-1">Descrição</p>
                  <p className="text-sm text-komaniya-text">{order.description}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-komaniya-border">
                <p className="text-xs font-medium text-komaniya-text-dim mb-2">Itens</p>
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-komaniya-text truncate pr-2">{item.productName} x{item.quantity}</span>
                      <span className="text-komaniya-text-dim">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 h-[600px]">
            <Chat orderId={order.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PedidoPage() {
  return (
    <Suspense fallback={
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 border-4 border-komaniya-green border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    }>
      <PedidoContent />
    </Suspense>
  );
}
