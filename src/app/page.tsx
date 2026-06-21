"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Gem, Check, TrendingDown, TrendingUp, Minus, ShoppingCart } from "lucide-react";
import { products, DISCORD_LINK } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ProductCard from "@/components/ProductCard";

const girosData = {
  baixa: {
    label: "Exploração Baixa",
    range: "0% até 39%",
    pricePerWish: 1.1,
    icon: TrendingDown,
    color: "green",
    packages: [
      { wishes: 5, price: 5.5 },
      { wishes: 10, price: 11.0 },
      { wishes: 20, price: 22.0 },
      { wishes: 30, price: 33.0 },
      { wishes: 50, price: 55.0 },
      { wishes: 100, price: 110.0 },
    ],
  },
  media: {
    label: "Exploração Média",
    range: "40% até 69%",
    pricePerWish: 1.3,
    icon: Minus,
    color: "gold",
    packages: [
      { wishes: 5, price: 6.5 },
      { wishes: 10, price: 13.0 },
      { wishes: 20, price: 26.0 },
      { wishes: 30, price: 39.0 },
      { wishes: 50, price: 65.0 },
    ],
  },
  alta: {
    label: "Exploração Alta",
    range: "70%+",
    pricePerWish: 1.5,
    icon: TrendingUp,
    color: "dark",
    packages: [
      { wishes: 5, price: 7.5 },
      { wishes: 10, price: 15.0 },
      { wishes: 20, price: 30.0 },
      { wishes: 30, price: 45.0 },
    ],
  },
};

type GirosLevel = keyof typeof girosData;

const featuredExploration = products.filter((p) => p.category === "exploracao").slice(0, 4);
const featuredEndgame = products.filter((p) => p.category === "endgame").slice(0, 4);

export default function HomePage() {
  const [girosLevel, setGirosLevel] = useState<GirosLevel>("baixa");
  const [selectedWishes, setSelectedWishes] = useState<number | null>(null);
  const { addItem } = useCart();
  const currentGiros = girosData[girosLevel];

  const handleAddGiros = () => {
    if (selectedWishes === null) return;
    const pkg = currentGiros.packages.find((p) => p.wishes === selectedWishes);
    if (!pkg) return;
    addItem({
      id: `giros-${girosLevel}-${selectedWishes}`,
      name: `${currentGiros.label} - ${selectedWishes} Giros`,
      price: pkg.price,
      category: "exploracao",
      description: `${selectedWishes} Destinos Entrelaçados (${currentGiros.label})`,
      available: true,
    });
    setSelectedWishes(null);
  };

  return (
    <>
      <Hero />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-komaniya-lime/10 border border-komaniya-lime/30 mb-6">
              <Gem className="w-4 h-4 text-komaniya-gold" />
              <span className="text-sm font-medium text-komaniya-dark">Serviço Mais Popular</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-komaniya-text-bright mb-4">
              Farm de{" "}
              <span className="text-glow-lime bg-gradient-to-r from-komaniya-lime to-komaniya-green bg-clip-text text-transparent">
                Primogemas
              </span>
            </h2>
            <p className="text-komaniya-text-dim max-w-xl mx-auto">
              Farm completo de Primogemas através de exploração, quests e eventos. Selecione o nível e a quantidade de giros.
            </p>
          </div>

          <div className="bg-komaniya-card card-border rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-komaniya-text-bright mb-4">
              1. Selecione seu nível de exploração
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {(Object.entries(girosData) as [GirosLevel, typeof girosData[GirosLevel]][]).map(([key, data]) => {
                const IconComp = data.icon;
                const colorMap: Record<string, { ring: string; bg: string; text: string }> = {
                  green: { ring: "border-komaniya-green", bg: "bg-komaniya-green/10", text: "text-komaniya-green" },
                  gold: { ring: "border-komaniya-gold", bg: "bg-komaniya-gold/10", text: "text-komaniya-gold" },
                  dark: { ring: "border-komaniya-dark", bg: "bg-komaniya-dark/10", text: "text-komaniya-dark" },
                };
                const c = colorMap[data.color];
                return (
                  <button key={key} onClick={() => { setGirosLevel(key); setSelectedWishes(null); }} className={`relative bg-komaniya-cream rounded-xl p-5 text-left transition-all duration-200 ${girosLevel === key ? `card-border ${c.ring} glow-green` : "card-border hover:bg-komaniya-card-hover"}`}>
                    {girosLevel === key && (
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full ${c.ring.replace("border", "bg")} flex items-center justify-center`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                      <IconComp className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <div className="font-semibold text-komaniya-text-bright text-sm">{data.label}</div>
                    <div className="text-xs text-komaniya-text-dim mt-1">{data.range}</div>
                    {girosLevel === key && (
                      <div className="mt-3 text-lg font-bold text-komaniya-gold">R$ {data.pricePerWish.toFixed(2)} / giro</div>
                    )}
                  </button>
                );
              })}
            </div>

            <h3 className="text-lg font-semibold text-komaniya-text-bright mb-4">
              2. Escolha a quantidade de giros
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {currentGiros.packages.map((pkg) => (
                <button key={pkg.wishes} onClick={() => setSelectedWishes(pkg.wishes)} className={`relative bg-komaniya-cream rounded-xl p-4 text-center transition-all duration-200 ${selectedWishes === pkg.wishes ? "card-border border-komaniya-gold glow-gold" : "card-border hover:bg-komaniya-card-hover"}`}>
                  {selectedWishes === pkg.wishes && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-komaniya-gold flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Gem className="w-4 h-4 text-komaniya-gold" />
                    <span className="text-xl font-bold text-komaniya-text-bright">{pkg.wishes}</span>
                  </div>
                  <div className="text-xs text-komaniya-text-dim mb-1">giros</div>
                  <div className="text-lg font-bold text-komaniya-gold">R$ {pkg.price.toFixed(2)}</div>
                </button>
              ))}
            </div>

            {selectedWishes !== null && (
              <div className="bg-komaniya-cream card-border rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-komaniya-text-dim mb-1">Resumo do Pedido</div>
                    <div className="text-komaniya-text-bright font-semibold">
                      {currentGiros.label} &bull; {selectedWishes} Giros
                    </div>
                    <div className="text-2xl font-bold text-komaniya-gold mt-1">
                      R$ {currentGiros.packages.find((p) => p.wishes === selectedWishes)?.price.toFixed(2)}
                    </div>
                  </div>
                  <button onClick={handleAddGiros} className="btn-primary text-base flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/servicos" className="btn-secondary inline-flex items-center gap-2">
              Ver Todos os Serviços
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-komaniya-beige/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-komaniya-text-bright mb-4">
              Exploração{" "}
              <span className="text-glow-green bg-gradient-to-r from-komaniya-green to-komaniya-lime bg-clip-text text-transparent">
                100%
              </span>
            </h2>
            <p className="text-komaniya-text-dim max-w-xl mx-auto">
              Desbloqueio completo de todas as regiões do mapa.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredExploration.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-komaniya-text-bright mb-4">
              End{" "}
              <span className="text-glow-gold bg-gradient-to-r from-komaniya-gold to-[#E0C080] bg-clip-text text-transparent">
                Game
              </span>
            </h2>
            <p className="text-komaniya-text-dim max-w-xl mx-auto">
              Abismo, Teatro e mais. Domine todos os desafios.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredEndgame.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <FAQ />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-komaniya-text-bright mb-4">
            Pronto para{" "}
            <span className="text-glow-green bg-gradient-to-r from-komaniya-lime to-komaniya-green bg-clip-text text-transparent">
              Começar?
            </span>
          </h2>
          <p className="text-komaniya-text-dim mb-8 max-w-xl mx-auto">
            Entre em contato pelo Discord e comece a farmar suas primogemas hoje mesmo!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/servicos" className="btn-primary flex items-center gap-2">
              Ver Pacotes
            </Link>
            <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="btn-discord flex items-center gap-2">
              Falar no Discord
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
