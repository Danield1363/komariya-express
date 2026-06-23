"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown, ShoppingCart, Shield, Bell, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/servicos", label: "Serviços" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, isEmployee, logout } = useAuth();
  const { itemCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-komaniya-darker/95 backdrop-blur-xl border-b border-komaniya-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center text-komaniya-darker font-bold text-sm">
              KE
            </div>
            <span className="text-lg font-bold text-komaniya-cream hidden sm:block group-hover:text-komaniya-lime transition-colors">
              Komaniya Express
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-komaniya-lime bg-komaniya-lime/10"
                    : "text-komaniya-cream/70 hover:text-komaniya-cream hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && isEmployee && (
              <Link
                href="/funcionario"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/funcionario"
                    ? "text-komaniya-lime bg-komaniya-lime/10"
                    : "text-komaniya-cream/70 hover:text-komaniya-cream hover:bg-white/5"
                }`}
              >
                Funcionário
              </Link>
            )}
            {isAuthenticated && isAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/admin"
                    ? "text-komaniya-lime bg-komaniya-lime/10"
                    : "text-komaniya-cream/70 hover:text-komaniya-cream hover:bg-white/5"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/carrinho"
              className={`relative p-2 rounded-lg transition-colors ${
                pathname === "/carrinho"
                  ? "text-komaniya-lime bg-komaniya-lime/10"
                  : "text-komaniya-cream/70 hover:text-komaniya-cream hover:bg-white/5"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-komaniya-lime text-komaniya-darker text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative p-2 rounded-lg transition-colors ${
                    notifOpen
                      ? "text-komaniya-lime bg-komaniya-lime/10"
                      : "text-komaniya-cream/70 hover:text-komaniya-cream hover:bg-white/5"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-komaniya-danger text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-komaniya-border rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-komaniya-border">
                      <span className="text-sm font-bold text-komaniya-text-bright">Notificações</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-komaniya-medium hover:text-komaniya-green transition-colors">
                          Marcar todas como lidas
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-komaniya-text-dim">
                          Nenhuma notificação
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              if (notif.orderId) {
                                window.location.href = `/pedidos?id=${notif.orderId}`;
                              }
                            }}
                            className={`w-full text-left px-4 py-3 border-b border-komaniya-border/50 hover:bg-komaniya-cream/50 transition-colors ${
                              !notif.read ? "bg-komaniya-green/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notif.read && <div className="w-2 h-2 rounded-full bg-komaniya-green mt-1.5 shrink-0" />}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-komaniya-text-bright truncate">{notif.title}</p>
                                <p className="text-xs text-komaniya-text-dim truncate mt-0.5">{notif.message}</p>
                                <p className="text-[10px] text-komaniya-text-dim mt-1">
                                  {new Date(notif.createdAt).toLocaleString("pt-BR")}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {user?.discordAvatar ? (
                    <img src={user.discordAvatar} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full gradient-green flex items-center justify-center text-komaniya-darker text-xs font-bold">
                      {user?.avatar}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm text-komaniya-cream">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-komaniya-cream/50" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-komaniya-border rounded-xl shadow-2xl overflow-hidden z-50">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-komaniya-text hover:bg-komaniya-cream/50 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-komaniya-medium" />
                        Painel Admin
                      </Link>
                    )}
                    {isEmployee && (
                      <Link
                        href="/funcionario"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-komaniya-text hover:bg-komaniya-cream/50 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-komaniya-medium" />
                        Painel Funcionário
                      </Link>
                    )}
                    <Link
                      href="/perfil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-komaniya-text hover:bg-komaniya-cream/50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Meu Perfil
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-komaniya-danger hover:bg-komaniya-cream/50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 btn-secondary text-sm !py-1.5 !px-3">
                <User className="w-4 h-4" />
                <span className="hidden sm:block">Entrar</span>
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5 text-komaniya-cream" /> : <Menu className="w-5 h-5 text-komaniya-cream" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-komaniya-dark/30">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href ? "text-komaniya-lime bg-komaniya-lime/10" : "text-komaniya-cream/70 hover:text-komaniya-cream hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && isEmployee && (
                <Link href="/funcionario" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-komaniya-cream/70 hover:text-komaniya-cream hover:bg-white/5 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Funcionário
                </Link>
              )}
              {isAuthenticated && isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-komaniya-cream/70 hover:text-komaniya-cream hover:bg-white/5 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
              <Link href="/carrinho" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-komaniya-cream/70 hover:text-komaniya-cream hover:bg-white/5 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Carrinho {itemCount > 0 && `(${itemCount})`}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
