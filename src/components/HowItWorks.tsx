"use client";

import { MessageCircle, CreditCard, Gamepad2, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Entre em Contato",
    description:
      "Entre no nosso servidor do Discord e abra um ticket com sua solicitação.",
    color: "green",
  },
  {
    icon: CreditCard,
    title: "Escolha & Pague",
    description:
      "Selecione o pacote desejado e realize o pagamento de forma segura.",
    color: "gold",
  },
  {
    icon: Gamepad2,
    title: "Farm Inicia",
    description:
      "Nossa equipe começa o farm de forma manual e segura na sua conta.",
    color: "lime",
  },
  {
    icon: CheckCircle,
    title: "Pronto!",
    description:
      "Receba suas primogemas e volte a jogar! Acompanhe o progresso pelo Discord.",
    color: "success",
  },
];

const colorMap: Record<string, { bg: string; icon: string; glow: string }> = {
  green: {
    bg: "bg-komaniya-green/10",
    icon: "text-komaniya-green",
    glow: "glow-green",
  },
  gold: {
    bg: "bg-komaniya-gold/10",
    icon: "text-komaniya-gold",
    glow: "glow-gold",
  },
  lime: {
    bg: "bg-komaniya-lime/10",
    icon: "text-komaniya-lime",
    glow: "glow-lime",
  },
  success: {
    bg: "bg-komaniya-medium/10",
    icon: "text-komaniya-medium",
    glow: "",
  },
};

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-komaniya-text-bright mb-4">
            Como{" "}
            <span className="text-glow-green bg-gradient-to-r from-komaniya-green to-komaniya-lime bg-clip-text text-transparent">
              Funciona
            </span>
          </h2>
          <p className="text-komaniya-text-dim max-w-xl mx-auto">
            Processo simples, rápido e seguro. Em poucos passos você já terá
            suas primogemas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const colors = colorMap[step.color];
            return (
              <div
                key={i}
                className={`relative bg-komaniya-card card-border rounded-2xl p-6 hover:bg-komaniya-card-hover transition-all duration-300 ${colors.glow}`}
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-komaniya-cream border border-komaniya-border flex items-center justify-center">
                  <span className="text-xs font-bold text-komaniya-text-dim">
                    {i + 1}
                  </span>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}
                >
                  <step.icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <h3 className="text-lg font-semibold text-komaniya-text-bright mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-komaniya-text-dim leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
