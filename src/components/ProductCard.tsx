"use client";

import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const inCart = !!cartItem;

  return (
    <div className={`bg-komaniya-card card-border rounded-2xl p-5 transition-all duration-300 hover:bg-komaniya-card-hover group ${inCart ? "glow-green border-komaniya-green/30" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-komaniya-text-bright text-sm leading-tight flex-1 pr-2">
          {product.name}
        </h3>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-black text-komaniya-gold">
            R$ {product.price.toFixed(2)}
          </div>
        </div>
      </div>

      {product.description && (
        <p className="text-xs text-komaniya-text-dim mb-4 leading-relaxed">{product.description}</p>
      )}

      {inCart ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => cartItem.quantity <= 1 ? removeItem(product.id) : updateQuantity(product.id, cartItem.quantity - 1)}
            className="w-8 h-8 rounded-lg bg-komaniya-danger/10 flex items-center justify-center hover:bg-komaniya-danger/20 transition-colors"
          >
            {cartItem.quantity <= 1 ? <Trash2 className="w-3.5 h-3.5 text-komaniya-danger" /> : <Minus className="w-3.5 h-3.5 text-komaniya-danger" />}
          </button>
          <span className="text-sm font-bold text-komaniya-text-bright min-w-[2rem] text-center">{cartItem.quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
            className="w-8 h-8 rounded-lg bg-komaniya-green/10 flex items-center justify-center hover:bg-komaniya-green/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-komaniya-green" />
          </button>
          <div className="ml-auto text-sm font-bold text-komaniya-gold">
            R$ {(product.price * cartItem.quantity).toFixed(2)}
          </div>
        </div>
      ) : (
        <button
          onClick={() => addItem(product)}
          className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Adicionar ao Carrinho
        </button>
      )}
    </div>
  );
}
