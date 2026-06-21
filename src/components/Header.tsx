"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown, ShoppingCart, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/servicos", label: "Serviços" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

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

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full gradient-green flex items-center justify-center text-komaniya-darker text-xs font-bold">
                    {user?.avatar}
                  </div>
                  <span className="hidden sm:block text-sm text-komaniya-cream">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-komaniya-cream/50" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
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
                  </>
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
