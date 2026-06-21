export type UserRole = "user" | "admin";

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
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: "exploracao" | "endgame";
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

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  totalPrice: number;
  status: OrderStatus;
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

export interface LoginAttempt {
  email: string;
  timestamp: number;
}

export interface RateLimitData {
  attempts: number;
  lastAttempt: number;
  lockedUntil: number;
}
