import { getSupabase } from "@/lib/supabase";
import {
  Order, OrderStatus, OrderPriority, PublicUser, CartItem,
  Message, EmployeeStatus, EmployeeAvailability, Notification, UserRole,
} from "@/types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const store = {
  // =============================================
  // Pedidos
  // =============================================

  async createOrder(userId: string, userName: string, items: CartItem[], description?: string): Promise<Order> {
    const sb = getSupabase();
    const orderId = "ORD-" + generateId().toUpperCase();
    const now = new Date().toISOString();
    const order = {
      id: orderId,
      user_id: userId,
      user_name: userName,
      description: description || "",
      items: items.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        quantity: ci.quantity,
        price: ci.product.price,
      })),
      total_price: items.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0),
      status: "pending" as OrderStatus,
      priority: "normal" as OrderPriority,
      created_at: now,
    };

    const { error } = await sb.from("orders").insert(order);
    if (error) {
      console.error("Erro ao criar pedido no Supabase:", error);
      throw error;
    }

    return {
      id: order.id,
      userId: order.user_id,
      userName: order.user_name,
      description: order.description,
      items: order.items,
      totalPrice: order.total_price,
      status: order.status,
      priority: order.priority,
      employeeId: null,
      assignedAt: null,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar pedidos do usuário:", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((o) => ({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name,
      description: o.description || "",
      items: o.items,
      totalPrice: o.total_price,
      status: o.status,
      priority: o.priority || "normal",
      employeeId: o.employee_id,
      assignedAt: o.assigned_at,
      completedAt: o.completed_at,
      createdAt: o.created_at,
    }));
  },

  async getOrdersByEmployee(employeeId: string): Promise<Order[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar pedidos do funcionário:", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((o) => ({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name,
      description: o.description || "",
      items: o.items,
      totalPrice: o.total_price,
      status: o.status,
      priority: o.priority || "normal",
      employeeId: o.employee_id,
      assignedAt: o.assigned_at,
      completedAt: o.completed_at,
      createdAt: o.created_at,
    }));
  },

  async getAllOrders(): Promise<Order[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar pedidos:", error.message);
      return [];
    }
    if (!data) return [];

    const employeeIds = [...new Set(data.map((o) => o.employee_id).filter(Boolean))] as string[];
    const employeeNames: Record<string, string> = {};
    if (employeeIds.length > 0) {
      const { data: profiles } = await sb.from("profiles").select("id, name").in("id", employeeIds);
      if (profiles) {
        profiles.forEach((p) => { employeeNames[p.id] = p.name; });
      }
    }

    return data.map((o) => ({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name,
      description: o.description || "",
      items: o.items,
      totalPrice: o.total_price,
      status: o.status,
      priority: o.priority || "normal",
      employeeId: o.employee_id,
      employeeName: o.employee_id ? employeeNames[o.employee_id] : undefined,
      assignedAt: o.assigned_at,
      completedAt: o.completed_at as string | null,
      createdAt: o.created_at as string,
    }));
  },

  async getPendingOrders(): Promise<Order[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar pedidos pendentes:", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((o) => ({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name,
      description: o.description || "",
      items: o.items,
      totalPrice: o.total_price,
      status: o.status,
      priority: o.priority || "normal",
      employeeId: o.employee_id,
      assignedAt: o.assigned_at,
      completedAt: o.completed_at,
      createdAt: o.created_at,
    }));
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const sb = getSupabase();
    const update: Record<string, unknown> = { status };
    if (status === "completed") update.completed_at = new Date().toISOString();
    const { error } = await sb.from("orders").update(update).eq("id", orderId);
    return !error;
  },

  async assignOrder(orderId: string, employeeId: string): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb.from("orders").update({
      employee_id: employeeId,
      status: "in_progress",
      assigned_at: new Date().toISOString(),
    }).eq("id", orderId);
    return !error;
  },

  async reassignOrder(orderId: string, newEmployeeId: string): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb.from("orders").update({
      employee_id: newEmployeeId,
      assigned_at: new Date().toISOString(),
    }).eq("id", orderId);
    return !error;
  },

  async cancelOrder(orderId: string): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb.from("orders").update({ status: "cancelled" }).eq("id", orderId);
    return !error;
  },

  // =============================================
  // Usuários
  // =============================================

  async getAllUsers(): Promise<PublicUser[]> {
    const sb = getSupabase();
    const { data, error } = await sb.from("profiles").select("*");
    if (error) {
      console.error("Erro ao buscar usuários:", error.message);
      return [];
    }
    if (!data) return [];
    return data.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email || "",
      role: u.role,
      avatar: u.avatar,
      createdAt: u.created_at,
      discordId: u.discord_id,
      discordUsername: u.discord_username,
      discordAvatar: u.discord_avatar,
    }));
  },

  async updateUserRole(userId: string, role: UserRole): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb.from("profiles").update({ role }).eq("id", userId);
    return !error;
  },

  async deleteUser(userId: string): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb.from("profiles").delete().eq("id", userId);
    return !error;
  },

  // =============================================
  // Funcionários
  // =============================================

  async getEmployeeStatuses(): Promise<EmployeeStatus[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("employee_status")
      .select("*, profiles!employee_status_employee_id_fkey(name, avatar)")
      .order("availability", { ascending: true });

    if (error) {
      console.error("Erro ao buscar status dos funcionários:", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((e: Record<string, unknown>) => ({
      employeeId: e.employee_id as string,
      employeeName: (e.profiles as { name: string } | null)?.name || "Funcionário",
      employeeAvatar: (e.profiles as { avatar: string } | null)?.avatar || "F",
      activeOrders: e.active_orders as number,
      maxOrders: e.max_orders as number,
      availability: e.availability as EmployeeAvailability,
      lastActive: e.last_active as string,
      updatedAt: e.updated_at as string,
    }));
  },

  async getAvailableEmployees(): Promise<EmployeeStatus[]> {
    const all = await this.getEmployeeStatuses();
    return all.filter((e) => e.availability === "online" && e.activeOrders < e.maxOrders);
  },

  async updateEmployeeAvailability(employeeId: string, availability: EmployeeAvailability): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb.from("employee_status").upsert({
      employee_id: employeeId,
      availability,
      last_active: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "employee_id" });
    return !error;
  },

  async getEmployeeOrderCount(employeeId: string): Promise<number> {
    const sb = getSupabase();
    const { count } = await sb
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("employee_id", employeeId)
      .not("status", "in", "(completed,cancelled)");
    return count || 0;
  },

  // =============================================
  // Mensagens (Chat)
  // =============================================

  async getMessages(orderId: string): Promise<Message[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("messages")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar mensagens:", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((m) => ({
      id: m.id,
      orderId: m.order_id,
      senderId: m.sender_id,
      senderName: m.sender_name,
      senderRole: m.sender_role as UserRole,
      content: m.content,
      imageUrl: m.image_url,
      readBy: m.read_by || [],
      createdAt: m.created_at,
    }));
  },

  async sendMessage(orderId: string, senderId: string, senderName: string, senderRole: UserRole, content: string, imageUrl?: string): Promise<Message | null> {
    const sb = getSupabase();
    const msg = {
      order_id: orderId,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      content,
      image_url: imageUrl || null,
      read_by: [senderId],
    };

    const { data, error } = await sb.from("messages").insert(msg).select().single();
    if (error) {
      console.error("Erro ao enviar mensagem:", error.message);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      orderId: data.order_id,
      senderId: data.sender_id,
      senderName: data.sender_name,
      senderRole: data.sender_role,
      content: data.content,
      imageUrl: data.image_url,
      readBy: data.read_by || [],
      createdAt: data.created_at,
    };
  },

  async markMessagesAsRead(orderId: string, userId: string): Promise<void> {
    const sb = getSupabase();
    const { error } = await sb.rpc("mark_messages_read", { p_order_id: orderId, p_user_id: userId });
    if (error) {
      const { data } = await sb.from("messages").select("id, read_by").eq("order_id", orderId);
      if (data) {
        data.forEach((m) => {
          if (!(m.read_by || []).includes(userId)) {
            sb.from("messages").update({ read_by: [...(m.read_by || []), userId] }).eq("id", m.id);
          }
        });
      }
    }
  },

  async uploadImage(file: File): Promise<string | null> {
    const sb = getSupabase();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
    const { error } = await sb.storage.from("chat-images").upload(fileName, file);
    if (error) return null;
    const { data: urlData } = sb.storage.from("chat-images").getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  },

  // =============================================
  // Notificações
  // =============================================

  async getNotifications(userId: string): Promise<Notification[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Erro ao buscar notificações:", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((n) => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      type: n.type,
      orderId: n.order_id,
      read: n.read,
      createdAt: n.created_at,
    }));
  },

  async getUnreadCount(userId: string): Promise<number> {
    const sb = getSupabase();
    const { count } = await sb
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);
    return count || 0;
  },

  async createNotification(userId: string, title: string, message: string, type: Notification["type"] = "info", orderId?: string): Promise<void> {
    const sb = getSupabase();
    await sb.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
      order_id: orderId || null,
    });
  },

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb.from("notifications").update({ read: true }).eq("id", notificationId);
    return !error;
  },

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
    return !error;
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb.from("notifications").delete().eq("id", notificationId);
    return !error;
  },

  // =============================================
  // Estatísticas (Admin)
  // =============================================

  async getStats() {
    const sb = getSupabase();
    const { data: orders, error: ordersErr } = await sb.from("orders").select("total_price, status, created_at");
    const { data: profiles, error: profilesErr } = await sb.from("profiles").select("id, role");
    const { data: employees, error: employeesErr } = await sb.from("employee_status").select("availability");

    if (ordersErr) console.error("Erro ao buscar stats (orders):", ordersErr.message);
    if (profilesErr) console.error("Erro ao buscar stats (profiles):", profilesErr.message);
    if (employeesErr) console.error("Erro ao buscar stats (employees):", employeesErr.message);

    const allOrders = orders || [];
    const allProfiles = profiles || [];
    const allEmployees = employees || [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyOrders = allOrders.filter((o) => {
      const d = new Date(o.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    return {
      totalUsers: allProfiles.length,
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((s, o) => s + (o.total_price || 0), 0),
      pendingOrders: allOrders.filter((o) => o.status === "pending").length,
      activeOrders: allOrders.filter((o) => o.status === "in_progress").length,
      completedOrders: allOrders.filter((o) => o.status === "completed").length,
      monthlyRevenue: monthlyOrders.reduce((s, o) => s + (o.total_price || 0), 0),
      monthlyOrders: monthlyOrders.length,
      employeesOnline: allEmployees.filter((e) => e.availability === "online").length,
      employeesBusy: allEmployees.filter((e) => e.availability === "busy").length,
      employeesOffline: allEmployees.filter((e) => e.availability === "offline").length,
    };
  },
};
