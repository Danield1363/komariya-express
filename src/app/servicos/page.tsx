"use client";

import { useState, useMemo } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Mountain, Swords, Gem, Search, Check, TrendingDown, TrendingUp, Minus, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type Tab = "exploracao" | "endgame" | "giros" | "conta";

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
      { wishes: 40, price: 44.0 },
      { wishes: 50, price: 55.0 },
      { wishes: 60, price: 66.0 },
      { wishes: 70, price: 77.0 },
      { wishes: 80, price: 88.0 },
      { wishes: 90, price: 99.0 },
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
      { wishes: 40, price: 52.0 },
      { wishes: 50, price: 65.0 },
      { wishes: 60, price: 78.0 },
      { wishes: 70, price: 91.0 },
      { wishes: 80, price: 104.0 },
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
      { wishes: 40, price: 60.0 },
    ],
  },
};

type GirosLevel = keyof typeof girosData;

export default function ServicosPage() {
  const [tab, setTab] = useState<Tab>("exploracao");
  const [search, setSearch] = useState("");
  const [girosLevel, setGirosLevel] = useState<GirosLevel>("baixa");
  const [selectedWishes, setSelectedWishes] = useState<number | null>(null);
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.category === tab);
    if (tab === "exploracao" && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.region && p.region.toLowerCase().includes(q)));
    }
    return list;
  }, [tab, search]);

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
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-komaniya-text-bright mb-4">
            Catálogo de{" "}
            <span className="text-glow-green bg-gradient-to-r from-komaniya-green to-komaniya-lime bg-clip-text text-transparent">
              Produtos
            </span>
          </h1>
          <p className="text-komaniya-text-dim max-w-xl mx-auto text-lg">
            Escolha o serviço ideal para acelerar seu progresso no Genshin Impact.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setTab("exploracao")} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${tab === "exploracao" ? "bg-komaniya-green text-white shadow-lg shadow-komaniya-green/20" : "bg-komaniya-card card-border text-komaniya-text-dim hover:text-komaniya-text"}`}>
              <Mountain className="w-4 h-4" /> Exploração 100%
            </button>
            <button onClick={() => setTab("endgame")} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${tab === "endgame" ? "bg-komaniya-gold text-white shadow-lg shadow-komaniya-gold/20" : "bg-komaniya-card card-border text-komaniya-text-dim hover:text-komaniya-text"}`}>
              <Swords className="w-4 h-4" /> End Game
            </button>
            <button onClick={() => setTab("giros")} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${tab === "giros" ? "bg-komaniya-lime text-komaniya-darker shadow-lg shadow-komaniya-lime/20" : "bg-komaniya-card card-border text-komaniya-text-dim hover:text-komaniya-text"}`}>
              <Gem className="w-4 h-4" /> Giros
            </button>
            <button onClick={() => setTab("conta")} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${tab === "conta" ? "bg-komaniya-medium text-white shadow-lg shadow-komaniya-medium/20" : "bg-komaniya-card card-border text-komaniya-text-dim hover:text-komaniya-text"}`}>
              <User className="w-4 h-4" /> Conta
            </button>
          </div>

          {tab === "exploracao" && (
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-komaniya-text-dim" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar região..." className="input-field !pl-9 !py-2.5 text-sm" />
            </div>
          )}
        </div>

        {tab === "exploracao" && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan", "Nodkrai"].map((region) => (
                <button key={region} onClick={() => setSearch(search === region ? "" : region)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${search === region ? "bg-komaniya-green text-white" : "bg-komaniya-cream border border-komaniya-border text-komaniya-text-dim hover:text-komaniya-text hover:border-komaniya-green/30"}`}>
                  {region}
                </button>
              ))}
            </div>
          </div>
        )}

        {(tab === "exploracao" || tab === "endgame" || tab === "conta") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {tab === "exploracao" || tab === "endgame" || tab === "conta" ? (
          filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-komaniya-text-dim">Nenhum serviço encontrado.</p>
            </div>
          )
        ) : null}

        {tab === "giros" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-komaniya-card card-border rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-komaniya-text-bright mb-2">
                Farm de{" "}
                <span className="text-glow-lime bg-gradient-to-r from-komaniya-lime to-komaniya-green bg-clip-text text-transparent">
                  Primogemas
                </span>
              </h2>
              <p className="text-komaniya-text-dim text-sm mb-6">
                Farm completo de Primogemas através de exploração, quests e eventos. Selecione seu nível de exploração e a quantidade de giros.
              </p>

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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
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

            <div className="bg-komaniya-card card-border rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-komaniya-text-bright mb-4">Sobre o Farm de Primogemas</h3>
              <div className="space-y-3 text-sm text-komaniya-text leading-relaxed">
                <p>Nosso serviço de farm de primogemas utiliza métodos manuais e seguros para maximizar a quantidade de primogemas que você recebe. Trabalhamos com exploração completa do mapa, coleta de caixas, conclusão de puzzles, quests world e muito mais.</p>
                <p>O preço varia de acordo com o nível de exploração atual da sua conta. Quanto mais explorado estiver o mapa, mais difícil e trabalhoso encontrar primogemas, por isso o preço unitário aumenta. Contas com baixa exploração oferecem o melhor custo-benefício!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
