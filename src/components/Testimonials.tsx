"use client";

import { Star } from "lucide-react";
import { testimonials } from "@/data/products";

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-komaniya-beige/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-komaniya-text-bright mb-4">
            O que nossos{" "}
            <span className="text-glow-gold bg-gradient-to-r from-komaniya-gold to-[#E0C080] bg-clip-text text-transparent">
              Clientes
            </span>{" "}
            dizem
          </h2>
          <p className="text-komaniya-text-dim max-w-xl mx-auto">
            Mais de 500 clientes satisfeitos confiam no nosso serviço.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-komaniya-card card-border rounded-2xl p-6 hover:bg-komaniya-card-hover transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center text-komaniya-darker text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-komaniya-text-bright text-sm">
                    {t.name}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < t.rating
                            ? "text-komaniya-gold fill-komaniya-gold"
                            : "text-komaniya-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-komaniya-text leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
