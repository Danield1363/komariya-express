import { getSupabase } from "@/lib/supabase";
import { Order, OrderStatus, PublicUser, CartItem } from "@/types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const store = {
  async createOrder(userId: string, userName: string, items: CartItem[]): Promise<Order> {
    const sb = getSupabase();
    const orderId = "ORD-" + generateId().toUpperCase();
    const order = {
      id: orderId,
      user_id: userId,
      user_name: userName,
      items: items.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        quantity: ci.quantity,
        price: ci.product.price,
      })),
      total_price: items.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0),
      status: "pending" as OrderStatus,
      created_at: new Date().toISOString().split("T")[0],
    };

    await sb.from("orders").insert(order);

    return {
      id: order.id,
      userId: order.user_id,
      userName: order.user_name,
      items: order.items,
      totalPrice: order.total_price,
      status: order.status,
      createdAt: order.created_at,
    };
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((o) => ({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name,
      items: o.items,
      totalPrice: o.total_price,
      status: o.status,
      createdAt: o.created_at,
    }));
  },

  async getAllOrders(): Promise<Order[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((o) => ({
      id: o.id,
      userId: o.user_id,
      userName: o.user_name,
      items: o.items,
      totalPrice: o.total_price,
      status: o.status,
      createdAt: o.created_at,
    }));
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    return !error;
  },

  async getAllUsers(): Promise<PublicUser[]> {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("profiles")
      .select("*");

    if (error || !data) return [];

    return data.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email || "",
      role: u.role,
      avatar: u.avatar,
      createdAt: u.created_at,
    }));
  },

  async updateUserRole(userId: string, role: "user" | "admin"): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    return !error;
  },

  async deleteUser(userId: string): Promise<boolean> {
    const sb = getSupabase();
    const { error } = await sb
      .from("profiles")
      .delete()
      .eq("id", userId);

    return !error;
  },

  async getStats() {
    const sb = getSupabase();
    const { data: orders } = await sb.from("orders").select("total_price, status");
    const { data: profiles } = await sb.from("profiles").select("id");

    const allOrders = orders || [];
    const allProfiles = profiles || [];

    return {
      totalUsers: allProfiles.length,
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((s, o) => s + (o.total_price || 0), 0),
      pendingOrders: allOrders.filter((o) => o.status === "pending").length,
    };
  },
};
