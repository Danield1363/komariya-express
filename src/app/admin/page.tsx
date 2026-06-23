"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, Users, DollarSign, Clock, CheckCircle, XCircle,
  TrendingUp, Shield, ShieldOff, Trash2,   UserCheck, MessageCircle,
  BarChart3, Calendar,
} from "lucide-react";
import { store } from "@/data/store";
import { Order, OrderStatus, EmployeeStatus, PublicUser } from "@/types";
import Link from "next/link";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  pending: { label: "Pendente", icon: Clock, color: "text-komaniya-gold", bg: "bg-komaniya-gold/10" },
  in_progress: { label: "Em Andamento", icon: Package, color: "text-komaniya-medium", bg: "bg-komaniya-medium/10" },
  completed: { label: "Concluído", icon: CheckCircle, color: "text-komaniya-green", bg: "bg-komaniya-green/10" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-komaniya-danger", bg: "bg-komaniya-danger/10" },
};

type Tab = "dashboard" | "orders" | "employees" | "users";

export default function AdminPage() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0,
    activeOrders: 0, completedOrders: 0, monthlyRevenue: 0, monthlyOrders: 0,
    employeesOnline: 0, employeesBusy: 0, employeesOffline: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [employees, setEmployees] = useState<EmployeeStatus[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<EmployeeStatus[]>([]);
  const [assigningOrder, setAssigningOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) router.push("/");
  }, [isAuthenticated, isAdmin, loading, router]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      Promise.all([
        store.getStats(),
        store.getAllOrders(),
        store.getAllUsers(),
        store.getEmployeeStatuses(),
        store.getAvailableEmployees(),
      ]).then(([s, o, u, e, ae]) => {
        setStats(s);
        setOrders(o);
        setUsers(u);
        setEmployees(e);
        setAvailableEmployees(ae);
      });
    }
  }, [isAuthenticated, isAdmin, refreshKey]);

  if (loading || !isAuthenticated || !isAdmin) return null;

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Pedidos", icon: Package },
    { id: "employees", label: "Funcionários", icon: UserCheck },
    { id: "users", label: "Usuários", icon: Users },
  ];

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await store.updateOrderStatus(orderId, status);
    setRefreshKey((k) => k + 1);
  };

  const handleAssignOrder = async (orderId: string, employeeId: string) => {
    await store.assignOrder(orderId, employeeId);
    await store.createNotification(
      employeeId,
      "Novo pedido atribuído",
      `Pedido ${orderId} foi atribuído a você.`,
      "order",
      orderId
    );
    setAssigningOrder(null);
    setRefreshKey((k) => k + 1);
  };

  const handleReassignOrder = async (orderId: string, newEmployeeId: string) => {
    await store.reassignOrder(orderId, newEmployeeId);
    setRefreshKey((k) => k + 1);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Tem certeza que deseja cancelar este pedido?")) {
      await store.cancelOrder(orderId);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "client" : "admin";
    await store.updateUserRole(userId, newRole);
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      await store.deleteUser(userId);
      setRefreshKey((k) => k + 1);
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  const roleLabels: Record<string, string> = { admin: "Admin", employee: "Funcionário", client: "Cliente" };
  const roleColors: Record<string, string> = {
    admin: "bg-komaniya-gold/10 text-komaniya-gold",
    employee: "bg-komaniya-medium/10 text-komaniya-medium",
    client: "bg-komaniya-cream text-komaniya-text-dim",
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8" key={refreshKey}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-komaniya-text-bright">Painel Admin</h1>
            <p className="text-komaniya-text-dim text-sm mt-1">Gerencie pedidos, funcionários e configurações.</p>
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
                { label: "Receita Total", value: `R$ ${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: "gold" },
                { label: "Receita Mensal", value: `R$ ${stats.monthlyRevenue.toFixed(0)}`, icon: Calendar, color: "medium" },
                { label: "Pedidos Totais", value: stats.totalOrders.toString(), icon: Package, color: "green" },
                { label: "Pedidos Ativos", value: stats.activeOrders.toString(), icon: TrendingUp, color: "lime" },
                { label: "Concluídos", value: stats.completedOrders.toString(), icon: CheckCircle, color: "green" },
                { label: "Pendentes", value: stats.pendingOrders.toString(), icon: Clock, color: "gold" },
                { label: "Funcionários Online", value: stats.employeesOnline.toString(), icon: UserCheck, color: "medium" },
                { label: "Funcionários Ocupados", value: stats.employeesBusy.toString(), icon: BarChart3, color: "gold" },
              ].map((stat, i) => (
                <div key={i} className="bg-komaniya-card card-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-komaniya-${stat.color}/10`}>
                      <stat.icon className={`w-5 h-5 text-komaniya-${stat.color}`} />
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
                {orders.slice(0, 5).map((order) => {
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
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(["all", "pending", "in_progress", "completed", "cancelled"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    filterStatus === s
                      ? "bg-komaniya-green/10 text-komaniya-medium border border-komaniya-green/20"
                      : "bg-komaniya-card text-komaniya-text-dim border border-komaniya-border hover:bg-komaniya-cream"
                  }`}
                >
                  {s === "all" ? "Todos" : statusConfig[s].label}
                </button>
              ))}
            </div>

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
                      <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Funcionário</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
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
                          <td className="px-4 py-3 text-xs text-komaniya-text-dim">
                            {order.employeeName || (
                              <span className="text-komaniya-gold">Não atribuído</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {(!order.employeeId && order.status === "pending") && (
                                <div className="relative">
                                  <button
                                    onClick={() => setAssigningOrder(assigningOrder === order.id ? null : order.id)}
                                    className="p-1.5 rounded-lg hover:bg-komaniya-cream transition-colors text-komaniya-medium"
                                    title="Atribuir funcionário"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                  </button>
                                  {assigningOrder === order.id && (
                                    <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-komaniya-border rounded-xl shadow-xl z-50 p-2">
                                      {availableEmployees.length === 0 ? (
                                        <p className="text-xs text-komaniya-text-dim p-2">Nenhum funcionário disponível</p>
                                      ) : (
                                        availableEmployees.map((emp) => (
                                          <button
                                            key={emp.employeeId}
                                            onClick={() => handleAssignOrder(order.id, emp.employeeId)}
                                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-komaniya-cream text-left text-sm"
                                          >
                                            <span className="text-komaniya-text-bright">{emp.employeeName}</span>
                                            <span className="text-xs text-komaniya-text-dim">({emp.activeOrders}/{emp.maxOrders})</span>
                                          </button>
                                        ))
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                              {order.employeeId && (
                                <button
                                  onClick={() => handleReassignOrder(order.id, "")}
                                  className="p-1.5 rounded-lg hover:bg-komaniya-cream transition-colors"
                                  title="Reatribuir"
                                >
                                  <UserCheck className="w-4 h-4 text-komaniya-text-dim" />
                                </button>
                              )}
                              <Link
                                href={`/pedidos?id=${order.id}`}
                                className="p-1.5 rounded-lg hover:bg-komaniya-cream transition-colors"
                                title="Chat"
                              >
                                <MessageCircle className="w-4 h-4 text-komaniya-text-dim" />
                              </Link>
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
                              {order.status !== "cancelled" && order.status !== "completed" && (
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="p-1.5 rounded-lg hover:bg-komaniya-cream transition-colors"
                                  title="Cancelar"
                                >
                                  <XCircle className="w-4 h-4 text-komaniya-danger/60" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-komaniya-text-dim">Nenhum pedido encontrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-komaniya-card card-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-komaniya-green" />
                  <span className="text-sm text-komaniya-text-dim">Online</span>
                </div>
                <div className="text-2xl font-bold text-komaniya-text-bright">{employees.filter((e) => e.availability === "online").length}</div>
              </div>
              <div className="bg-komaniya-card card-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-komaniya-gold" />
                  <span className="text-sm text-komaniya-text-dim">Ocupados</span>
                </div>
                <div className="text-2xl font-bold text-komaniya-text-bright">{employees.filter((e) => e.availability === "busy").length}</div>
              </div>
              <div className="bg-komaniya-card card-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-komaniya-text-dim" />
                  <span className="text-sm text-komaniya-text-dim">Offline</span>
                </div>
                <div className="text-2xl font-bold text-komaniya-text-bright">{employees.filter((e) => e.availability === "offline").length}</div>
              </div>
            </div>

            <div className="bg-komaniya-card card-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-komaniya-border">
                      <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Funcionário</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Pedidos Ativos</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Limite</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Última Atividade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.employeeId} className="border-b border-komaniya-border/50 hover:bg-komaniya-cream/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center text-komaniya-darker text-xs font-bold">
                              {emp.employeeAvatar}
                            </div>
                            <span className="font-medium text-komaniya-text-bright">{emp.employeeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              emp.availability === "online" ? "bg-komaniya-green" :
                              emp.availability === "busy" ? "bg-komaniya-gold" : "bg-komaniya-text-dim"
                            }`} />
                            <span className="text-xs capitalize text-komaniya-text-dim">{emp.availability}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-komaniya-text-bright">{emp.activeOrders}</span>
                            <div className="w-16 h-1.5 bg-komaniya-cream rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  emp.activeOrders >= emp.maxOrders ? "bg-komaniya-gold" : "bg-komaniya-medium"
                                }`}
                                style={{ width: `${(emp.activeOrders / emp.maxOrders) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-komaniya-text-dim">{emp.maxOrders}</td>
                        <td className="px-4 py-3 text-xs text-komaniya-text-dim">
                          {new Date(emp.lastActive).toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-komaniya-text-dim">Nenhum funcionário registrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
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
                    <th className="text-left px-4 py-3 text-xs font-medium text-komaniya-text-dim uppercase">Discord</th>
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
                      <td className="px-4 py-3 text-komaniya-text-dim text-xs">{u.discordUsername || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || "bg-komaniya-cream text-komaniya-text-dim"}`}>
                          {roleLabels[u.role] || u.role}
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
