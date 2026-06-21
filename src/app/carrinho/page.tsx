"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageCircle, ExternalLink, CheckCircle } from "lucide-react";
import { DISCORD_LINK } from "@/data/products";
import { store } from "@/data/store";
import { useState } from "react";
import Link from "next/link";

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }
    const order = await store.createOrder(user.id, user.name, items);
    setOrderId(order.id);
    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-komaniya-green/10 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-komaniya-green" />
          </div>
          <h1 className="text-3xl font-bold text-komaniya-text-bright mb-3">Pedido Realizado!</h1>
          <p className="text-komaniya-text-dim mb-2">Seu pedido <span className="font-mono font-bold text-komaniya-gold">{orderId}</span> foi criado com sucesso.</p>
          <p className="text-sm text-komaniya-text-dim mb-8">Entre no Discord para finalizar o pagamento e acompanhar o progresso.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="btn-discord flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> Finalizar no Discord
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
            <Link href="/perfil" className="btn-secondary flex items-center justify-center gap-2">
              Ver Meus Pedidos
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-komaniya-cream border border-komaniya-border flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-komaniya-text-dim" />
          </div>
          <h1 className="text-3xl font-bold text-komaniya-text-bright mb-3">Carrinho Vazio</h1>
          <p className="text-komaniya-text-dim mb-8">Adicione serviços ao carrinho para continuar.</p>
          <Link href="/servicos" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Ver Serviços
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-komaniya-text-bright">Carrinho ({itemCount})</h1>
          <button onClick={clearCart} className="text-sm text-komaniya-danger hover:text-komaniya-danger/80 transition-colors">
            Limpar tudo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-komaniya-card card-border rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-komaniya-text-bright text-sm">{item.product.name}</h3>
                  {item.product.region && <p className="text-xs text-komaniya-text-dim mt-0.5">{item.product.region}</p>}
                  <p className="text-sm font-bold text-komaniya-gold mt-1">R$ {item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => item.quantity <= 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-komaniya-cream border border-komaniya-border flex items-center justify-center hover:bg-komaniya-card-hover transition-colors"
                  >
                    {item.quantity <= 1 ? <Trash2 className="w-3.5 h-3.5 text-komaniya-danger" /> : <Minus className="w-3.5 h-3.5 text-komaniya-text-dim" />}
                  </button>
                  <span className="text-sm font-bold text-komaniya-text-bright min-w-[1.5rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-komaniya-cream border border-komaniya-border flex items-center justify-center hover:bg-komaniya-card-hover transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-komaniya-text-dim" />
                  </button>
                </div>
                <div className="text-sm font-bold text-komaniya-gold min-w-[5rem] text-right">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-komaniya-card card-border rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-komaniya-text-bright mb-4">Resumo do Pedido</h3>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-komaniya-text-dim truncate pr-2">{item.product.name} x{item.quantity}</span>
                    <span className="font-medium text-komaniya-text-bright">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-komaniya-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-komaniya-text-bright">Total</span>
                  <span className="text-2xl font-black text-komaniya-gold">R$ {total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isAuthenticated ? "Finalizar Pedido" : "Faça Login para Comprar"}
              </button>
              {!isAuthenticated && (
                <p className="text-xs text-komaniya-text-dim text-center mt-3">
                  <Link href="/login" className="text-komaniya-medium hover:text-komaniya-green font-medium">Entrar</Link> ou{" "}
                  <Link href="/registrar" className="text-komaniya-medium hover:text-komaniya-green font-medium">criar conta</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
