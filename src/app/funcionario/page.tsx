"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { store } from "@/data/store";
import { Order, OrderStatus } from "@/types";
import Link from "next/link";
import {
  Package, Clock, CheckCircle, XCircle, MessageCircle, BarChart3,
  ToggleLeft, ToggleRight, History,
} from "lucide-react";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  pending: { label: "Pendente", icon: Clock, color: "text-komaniya-gold", bg: "bg-komaniya-gold/10" },
  in_progress: { label: "Em Andamento", icon: Package, color: "text-komaniya-medium", bg: "bg-komaniya-medium/10" },
  completed: { label: "Concluído", icon: CheckCircle, color: "text-komaniya-green", bg: "bg-komaniya-green/10" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-komaniya-danger", bg: "bg-komaniya-danger/10" },
};

type Tab = "active" | "history";

export default function FuncionarioPage() {
  const { user, isAuthenticated, isEmployee, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [maxOrders] = useState(2);
  const [isOnline, setIsOnline] = useState(false);
  const [refreshKey] = useState(0);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isEmployee)) router.push("/");
  }, [isAuthenticated, isEmployee, loading, router]);

  useEffect(() => {
    if (!user || !isEmployee) return;
    const loadData = async () => {
      const [allOrders, statuses] = await Promise.all([
        store.getOrdersByEmployee(user.id),
        store.getEmployeeStatuses(),
      ]);
      setOrders(allOrders);
      const myStatus = statuses.find((s) => s.employeeId === user.id);
      if (myStatus) {
        setActiveOrdersCount(myStatus.activeOrders);
        setIsOnline(myStatus.availability === "online");
      }
    };
    loadData();
  }, [user, isEmployee, refreshKey]);

  const handleToggleOnline = async () => {
    if (!user) return;
    const newStatus = isOnline ? "offline" : "online";
    await store.updateEmployeeAvailability(user.id, newStatus);
    setIsOnline(!isOnline);
  };

  if (loading || !isAuthenticated || !isEmployee) return null;

  const activeOrders = orders.filter((o) => o.status === "in_progress" || o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "cancelled");

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8" key={refreshKey}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-komaniya-text-bright">Painel do Funcionário</h1>
            <p className="text-komaniya-text-dim text-sm mt-1">Gerencie seus pedidos atribuídos.</p>
          </div>
          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isOnline
                ? "bg-komaniya-green/10 text-komaniya-green border border-komaniya-green/20"
                : "bg-komaniya-cream text-komaniya-text-dim border border-komaniya-border"
            }`}
          >
            {isOnline ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {isOnline ? "Online" : "Offline"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-komaniya-card card-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-komaniya-medium/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-komaniya-medium" />
              </div>
              <span className="text-sm text-komaniya-text-dim">Pedidos Ativos</span>
            </div>
            <div className="text-2xl font-bold text-komaniya-text-bright">{activeOrdersCount}</div>
            <div className="text-xs text-komaniya-text-dim mt-1">Limite: {maxOrders}</div>
            <div className="mt-2 h-1.5 bg-komaniya-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-komaniya-medium rounded-full transition-all"
                style={{ width: `${(activeOrdersCount / maxOrders) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-komaniya-card card-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-komaniya-green/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-komaniya-green" />
              </div>
              <span className="text-sm text-komaniya-text-dim">Concluídos</span>
            </div>
            <div className="text-2xl font-bold text-komaniya-text-bright">{completedOrders.filter((o) => o.status === "completed").length}</div>
          </div>

          <div className="bg-komaniya-card card-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-komaniya-gold/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-komaniya-gold" />
              </div>
              <span className="text-sm text-komaniya-text-dim">Total de Pedidos</span>
            </div>
            <div className="text-2xl font-bold text-komaniya-text-bright">{orders.length}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: "active" as Tab, label: "Pedidos Ativos", icon: Package, count: activeOrders.length },
            { id: "history" as Tab, label: "Histórico", icon: History, count: completedOrders.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-komaniya-green/10 text-komaniya-medium border border-komaniya-green/20"
                  : "bg-komaniya-card text-komaniya-text-dim hover:text-komaniya-text border border-komaniya-border"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-komaniya-medium/20" : "bg-komaniya-cream"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {activeTab === "active" && (
          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <div className="bg-komaniya-card card-border rounded-xl p-8 text-center">
                <Package className="w-10 h-10 text-komaniya-text-dim mx-auto mb-3" />
                <p className="text-komaniya-text-dim">Nenhum pedido ativo no momento.</p>
              </div>
            ) : (
              activeOrders.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <div key={order.id} className="bg-komaniya-card card-border rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-mono text-komaniya-text-dim">{order.id}</span>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <status.icon className="w-3 h-3" /> {status.label}
                        </div>
                      </div>
                      <p className="text-sm text-komaniya-text-bright font-medium truncate">
                        {order.items.map((i) => i.productName).join(", ")}
                      </p>
                      <p className="text-xs text-komaniya-text-dim mt-0.5">
                        {order.userName} - R$ {order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      href={`/pedidos?id=${order.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-komaniya-green/10 text-komaniya-medium text-sm font-medium hover:bg-komaniya-green/20 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            {completedOrders.length === 0 ? (
              <div className="bg-komaniya-card card-border rounded-xl p-8 text-center">
                <History className="w-10 h-10 text-komaniya-text-dim mx-auto mb-3" />
                <p className="text-komaniya-text-dim">Nenhum pedido no histórico.</p>
              </div>
            ) : (
              completedOrders.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <div key={order.id} className="bg-komaniya-card card-border rounded-xl p-4 flex items-center gap-4 opacity-75">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-mono text-komaniya-text-dim">{order.id}</span>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <status.icon className="w-3 h-3" /> {status.label}
                        </div>
                      </div>
                      <p className="text-sm text-komaniya-text-bright font-medium truncate">
                        {order.items.map((i) => i.productName).join(", ")}
                      </p>
                      <p className="text-xs text-komaniya-text-dim mt-0.5">
                        {order.userName} - R$ {order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      href={`/pedidos?id=${order.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-komaniya-cream text-komaniya-text-dim text-sm font-medium hover:bg-komaniya-border transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
