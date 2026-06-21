"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, Users, DollarSign, Clock, CheckCircle, XCircle,
  TrendingUp, Shield, ShieldOff, Trash2,
} from "lucide-react";
import { store } from "@/data/store";
import { Order, OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  pending: { label: "Pendente", icon: Clock, color: "text-komaniya-gold", bg: "bg-komaniya-gold/10" },
  in_progress: { label: "Em Andamento", icon: Package, color: "text-komaniya-medium", bg: "bg-komaniya-medium/10" },
  completed: { label: "Concluído", icon: CheckCircle, color: "text-komaniya-green", bg: "bg-komaniya-green/10" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-komaniya-danger", bg: "bg-komaniya-danger/10" },
};

type Tab = "dashboard" | "orders" | "users";

export default function AdminPage() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string; avatar: string; createdAt: string }[]>([]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) router.push("/");
  }, [isAuthenticated, isAdmin, loading, router]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      store.getStats().then(setStats);
      store.getAllOrders().then(setOrders);
      store.getAllUsers().then(setUsers);
    }
  }, [isAuthenticated, isAdmin, refreshKey]);

  if (loading || !isAuthenticated || !isAdmin) return null;

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Pedidos", icon: Package },
    { id: "users", label: "Usuários", icon: Users },
  ];

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await store.updateOrderStatus(orderId, status);
    setRefreshKey((k) => k + 1);
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    await store.updateUserRole(userId, currentRole === "admin" ? "user" : "admin");
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      await store.deleteUser(userId);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8" key={refreshKey}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-komaniya-text-bright">Painel Admin</h1>
            <p className="text-komaniya-text-dim text-sm mt-1">Gerencie pedidos, usuários e configurações.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-komaniya-green/10 border border-komaniya-green/20">
            <div className="w-2 h-2 rounded-full bg-komaniya-green animate-pulse" />
            <span className="text-xs font-medium text-komaniya-green">Online</span>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-komaniya-green/10 text-komaniya-medium border border-komaniya-green/20"
                  : "bg-komaniya-card text-komaniya-text-dim hover:text-komaniya-text border border-komaniya-border"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Pedidos Totais", value: stats.totalOrders.toString(), icon: Package, color: "green" },
                { label: "Receita Total", value: `R$ ${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: "gold" },
                { label: "Usuários", value: stats.totalUsers.toString(), icon: Users, color: "lime" },
                { label: "Pedidos Pendentes", value: stats.pendingOrders.toString(), icon: TrendingUp, color: "medium" },
              ].map((stat, i) => (
                <div key={i} className="bg-komaniya-card card-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-komaniya-${stat.color === "medium" ? "medium" : stat.color}/10`}>
                      <stat.icon className={`w-5 h-5 text-komaniya-${stat.color === "medium" ? "medium" : stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-komaniya-text-bright">{stat.value}</div>
                  <div className="text-xs text-komaniya-text-dim mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-komaniya-card card-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-komaniya-text-bright mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-komaniya-text-dim" /> Últimos Pedidos
              </h3>
              <div className="space-y-2">
                {orders.slice(-5).reverse().map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-komaniya-border/30 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-komaniya-text-dim">{order.id}</span>
                        <span className="text-sm text-komaniya-text-bright">{order.userName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-komaniya-gold">R$ {order.totalPrice.toFixed(2)}</span>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <status.icon className="w-3 h-3" /> {status.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {orders.length === 0 && <p className="text-sm text-komaniya-text-dim text-center py-4">Nenhum pedido ainda.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-komaniya-card card-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-komaniya-border">
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Cliente</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Itens</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Valor</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = statusConfig[order.status];
                    return (
                      <tr key={order.id} className="border-b border-komaniya-border/50 hover:bg-komaniya-cream/50">
                        <td className="px-4 py-3 font-mono text-komaniya-text-dim text-xs">{order.id}</td>
                        <td className="px-4 py-3 text-komaniya-text-bright">{order.userName}</td>
                        <td className="px-4 py-3 text-komaniya-text text-xs max-w-[200px] truncate">{order.items.map((i) => i.productName).join(", ")}</td>
                        <td className="px-4 py-3 font-bold text-komaniya-gold">R$ {order.totalPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            <status.icon className="w-3 h-3" /> {status.label}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="text-xs bg-komaniya-cream border border-komaniya-border rounded-lg px-2 py-1.5 text-komaniya-text focus:outline-none focus:border-komaniya-green"
                          >
                            <option value="pending">Pendente</option>
                            <option value="in_progress">Em Andamento</option>
                            <option value="completed">Concluído</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-komaniya-text-dim">Nenhum pedido encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-komaniya-card card-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-komaniya-border">
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Usuário</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Cargo</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Desde</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-komaniya-border/50 hover:bg-komaniya-cream/50">
                      <td className="px-4 py-3 font-medium text-komaniya-text-bright">{u.name}</td>
                      <td className="px-4 py-3 text-komaniya-text-dim">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-komaniya-gold/10 text-komaniya-gold" : "bg-komaniya-cream text-komaniya-text-dim"}`}>
                          {u.role === "admin" ? "Admin" : "Usuário"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-komaniya-text-dim text-xs">{u.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRoleToggle(u.id, u.role)}
                            className="p-1.5 rounded-lg hover:bg-komaniya-cream transition-colors"
                            title={u.role === "admin" ? "Remover admin" : "Promover a admin"}
                          >
                            {u.role === "admin" ? <ShieldOff className="w-4 h-4 text-komaniya-gold" /> : <Shield className="w-4 h-4 text-komaniya-text-dim" />}
                          </button>
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg hover:bg-komaniya-cream transition-colors"
                              title="Excluir usuário"
                            >
                              <Trash2 className="w-4 h-4 text-komaniya-danger/60" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
