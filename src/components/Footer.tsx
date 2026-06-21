import Link from "next/link";
import { MessageCircle, Mail, Shield, Heart } from "lucide-react";
import { DISCORD_LINK } from "@/data/products";

export default function Footer() {
  return (
    <footer className="bg-komaniya-darker border-t border-komaniya-dark/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center text-komaniya-darker font-bold text-sm">
                KE
              </div>
              <span className="text-lg font-bold text-komaniya-cream">
                Komaniya Express
              </span>
            </div>
            <p className="text-komaniya-cream/60 text-sm leading-relaxed max-w-md">
              Serviços profissionais de farm para Genshin Impact. Primogemas,
              exploração, coleta de recursos e muito mais. Seguro, rápido e
              confiável.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#5865F2]/20 flex items-center justify-center hover:bg-[#5865F2]/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#5865F2]" />
              </a>
              <a
                href="mailto:contato@komaniyaexpress.com.br"
                className="w-9 h-9 rounded-lg bg-komaniya-green/20 flex items-center justify-center hover:bg-komaniya-green/30 transition-colors"
              >
                <Mail className="w-4 h-4 text-komaniya-green" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-komaniya-cream font-semibold text-sm mb-4">
              Navegação
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-komaniya-cream/60 text-sm hover:text-komaniya-cream transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/servicos"
                  className="text-komaniya-cream/60 text-sm hover:text-komaniya-cream transition-colors"
                >
                  Serviços
                </Link>
              </li>
              <li>
                <Link
                  href="/servicos/farm-primogemas"
                  className="text-komaniya-cream/60 text-sm hover:text-komaniya-cream transition-colors"
                >
                  Farm de Primogemas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-komaniya-cream font-semibold text-sm mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-komaniya-cream/60 text-sm flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Privacidade
                </span>
              </li>
              <li>
                <span className="text-komaniya-cream/60 text-sm flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Termos de Uso
                </span>
              </li>
              <li>
                <span className="text-komaniya-cream/60 text-sm flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Reembolso
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-komaniya-dark/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-komaniya-cream/40 text-xs">
            © {new Date().getFullYear()} Komaniya Express. Todos os direitos
            reservados.
          </p>
          <p className="text-komaniya-cream/40 text-xs flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-komaniya-lime" /> para a
            comunidade brasileira
          </p>
        </div>
      </div>
    </footer>
  );
}
