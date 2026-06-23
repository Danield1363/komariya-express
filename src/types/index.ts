export type UserRole = "client" | "employee" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
  discordId?: string;
  discordUsername?: string;
  discordAvatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "exploracao" | "endgame" | "conta";
  region?: string;
  description?: string;
  available: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type OrderPriority = "low" | "normal" | "high" | "urgent";

export interface Order {
  id: string;
  userId: string;
  userName: string;
  description: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  totalPrice: number;
  status: OrderStatus;
  priority: OrderPriority;
  employeeId: string | null;
  employeeName?: string;
  assignedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  imageUrl: string | null;
  readBy: string[];
  createdAt: string;
}

export type EmployeeAvailability = "online" | "offline" | "busy";

export interface EmployeeStatus {
  employeeId: string;
  employeeName?: string;
  employeeAvatar?: string;
  activeOrders: number;
  maxOrders: number;
  availability: EmployeeAvailability;
  lastActive: string;
  updatedAt: string;
}

export interface DiscordRole {
  id: string;
  discordId: string;
  role: UserRole;
  updatedAt: string;
}

export type NotificationType = "info" | "success" | "warning" | "order" | "message";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  orderId: string | null;
  read: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}
