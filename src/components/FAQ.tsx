"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqItems } from "@/data/products";

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-komaniya-text-bright mb-4">
            Perguntas{" "}
            <span className="text-glow-green bg-gradient-to-r from-komaniya-green to-komaniya-lime bg-clip-text text-transparent">
              Frequentes
            </span>
          </h2>
          <p className="text-komaniya-text-dim">
            Encontre respostas para as dúvidas mais comuns.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="bg-komaniya-card card-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenId(openId === item.id ? null : item.id)
                }
                className="w-full flex items-center gap-3 p-5 text-left hover:bg-komaniya-card-hover transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-komaniya-medium flex-shrink-0" />
                <span className="flex-1 font-medium text-komaniya-text-bright text-sm">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-komaniya-text-dim transition-transform duration-200 ${
                    openId === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openId === item.id && (
                <div className="px-5 pb-5 pl-13">
                  <p className="text-sm text-komaniya-text leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
