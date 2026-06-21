import { User, PublicUser, Order, OrderStatus, CartItem, RateLimitData } from "@/types";

const KEYS = {
  USERS: "komaniya_users",
  ORDERS: "komaniya_orders",
  CART: "komaniya_cart",
  AUTH: "komaniya_auth",
  RATE_LIMIT: "komaniya_rate_limit",
} as const;

function getStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "komaniya_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function toPublic(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...pub } = user;
  return pub;
}

function getRateLimit(email: string): RateLimitData {
  const all = getStore<Record<string, RateLimitData>>(KEYS.RATE_LIMIT, {});
  return all[email] || { attempts: 0, lastAttempt: 0, lockedUntil: 0 };
}

function setRateLimit(email: string, data: RateLimitData): void {
  const all = getStore<Record<string, RateLimitData>>(KEYS.RATE_LIMIT, {});
  all[email] = data;
  setStore(KEYS.RATE_LIMIT, all);
}

function initAdmin() {
  const users = getStore<User[]>(KEYS.USERS, []);
  if (users.length === 0) {
    hashPassword("admin123").then((hash) => {
      users.push({
        id: "admin-001",
        name: "Admin",
        email: "admin@komaniyaexpress.com.br",
        passwordHash: hash,
        role: "admin",
        avatar: "AD",
        createdAt: new Date().toISOString().split("T")[0],
      });
      hashPassword("danield123").then((hash2) => {
        users.push({
          id: "admin-danield",
          name: "Danield",
          email: "danield@komaniyaexpress.com.br",
          passwordHash: hash2,
          role: "admin",
          avatar: "DA",
          createdAt: new Date().toISOString().split("T")[0],
        });
        setStore(KEYS.USERS, users);
      });
    });
  } else if (!users.find((u) => u.id === "admin-danield")) {
    hashPassword("danield123").then((hash) => {
      users.push({
        id: "admin-danield",
        name: "Danield",
        email: "danield@komaniyaexpress.com.br",
        passwordHash: hash,
        role: "admin",
        avatar: "DA",
        createdAt: new Date().toISOString().split("T")[0],
      });
      setStore(KEYS.USERS, users);
    });
  }
}

export const store = {
  init: () => {
    if (typeof window !== "undefined") {
      initAdmin();
    }
  },

  async register(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const users = getStore<User[]>(KEYS.USERS, []);
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Este email já está cadastrado." };
    }
    const passwordHash = await hashPassword(password);
    const user: User = {
      id: generateId(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
      avatar: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      createdAt: new Date().toISOString().split("T")[0],
    };
    users.push(user);
    setStore(KEYS.USERS, users);
    setStore(KEYS.AUTH, user.id);
    return { success: true };
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: PublicUser; error?: string }> {
    const rl = getRateLimit(email);
    const now = Date.now();
    if (rl.lockedUntil > now) {
      const waitMin = Math.ceil((rl.lockedUntil - now) / 60000);
      return { success: false, error: `Conta bloqueada. Tente novamente em ${waitMin} minuto(s).` };
    }

    const users = getStore<User[]>(KEYS.USERS, []);
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) {
      const attempts = rl.attempts + 1;
      setRateLimit(email, {
        attempts,
        lastAttempt: now,
        lockedUntil: attempts >= 5 ? now + 15 * 60 * 1000 : 0,
      });
      return { success: false, error: "Email ou senha inválidos." };
    }

    const hash = await hashPassword(password);
    if (user.passwordHash !== hash) {
      const attempts = rl.attempts + 1;
      setRateLimit(email, {
        attempts,
        lastAttempt: now,
        lockedUntil: attempts >= 5 ? now + 15 * 60 * 1000 : 0,
      });
      return { success: false, error: "Email ou senha inválidos." };
    }

    setRateLimit(email, { attempts: 0, lastAttempt: 0, lockedUntil: 0 });
    setStore(KEYS.AUTH, user.id);
    return { success: true, user: toPublic(user) };
  },

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const users = getStore<User[]>(KEYS.USERS, []);
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) return { success: false, error: "Email não encontrado." };
    const newPass = "Reset" + Math.random().toString(36).slice(2, 8);
    user.passwordHash = await hashPassword(newPass);
    setStore(KEYS.USERS, users);
    return { success: true };
  },

  getCurrentUser(): PublicUser | null {
    const userId = getStore<string | null>(KEYS.AUTH, null);
    if (!userId) return null;
    const users = getStore<User[]>(KEYS.USERS, []);
    const user = users.find((u) => u.id === userId);
    return user ? toPublic(user) : null;
  },

  logout() {
    setStore(KEYS.AUTH, null);
  },

  getAllUsers(): PublicUser[] {
    const users = getStore<User[]>(KEYS.USERS, []);
    return users.map(toPublic);
  },

  updateUserRole(userId: string, role: "user" | "admin"): boolean {
    const users = getStore<User[]>(KEYS.USERS, []);
    const user = users.find((u) => u.id === userId);
    if (!user) return false;
    user.role = role;
    setStore(KEYS.USERS, users);
    return true;
  },

  deleteUser(userId: string): boolean {
    const users = getStore<User[]>(KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return false;
    users.splice(idx, 1);
    setStore(KEYS.USERS, users);
    return true;
  },

  createOrder(userId: string, userName: string, items: CartItem[]): Order {
    const orders = getStore<Order[]>(KEYS.ORDERS, []);
    const order: Order = {
      id: "ORD-" + generateId().toUpperCase(),
      userId,
      userName,
      items: items.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        quantity: ci.quantity,
        price: ci.product.price,
      })),
      totalPrice: items.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0),
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    orders.push(order);
    setStore(KEYS.ORDERS, orders);
    return order;
  },

  getOrdersByUser(userId: string): Order[] {
    const orders = getStore<Order[]>(KEYS.ORDERS, []);
    return orders.filter((o) => o.userId === userId);
  },

  getAllOrders(): Order[] {
    return getStore<Order[]>(KEYS.ORDERS, []);
  },

  updateOrderStatus(orderId: string, status: OrderStatus): boolean {
    const orders = getStore<Order[]>(KEYS.ORDERS, []);
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;
    order.status = status;
    setStore(KEYS.ORDERS, orders);
    return true;
  },

  getCart(): CartItem[] {
    return getStore<CartItem[]>(KEYS.CART, []);
  },

  setCart(items: CartItem[]): void {
    setStore(KEYS.CART, items);
  },

  clearCart(): void {
    setStore(KEYS.CART, []);
  },

  getStats() {
    const users = getStore<User[]>(KEYS.USERS, []);
    const orders = getStore<Order[]>(KEYS.ORDERS, []);
    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((s, o) => s + o.totalPrice, 0),
      pendingOrders: orders.filter((o) => o.status === "pending").length,
    };
  },
};
