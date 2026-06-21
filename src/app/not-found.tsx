"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="text-8xl font-bold text-komaniya-gold/20 mb-4">404</div>
        <h1 className="text-2xl font-bold text-komaniya-text-bright mb-2">
          Página não encontrada
        </h1>
        <p className="text-komaniya-text-dim mb-8">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>
    </section>
  );
}
