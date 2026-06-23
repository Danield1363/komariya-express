"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DISCORD_LINK } from "@/data/products";

export default function Hero() {
  return (
    <section className="relative overflow-hidden w-full" style={{ minHeight: "clamp(400px, 50vw, 650px)" }}>
      <Image
        src="/banner.jpg"
        alt="Komaniya Express - Serviços de Genshin Impact"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-komaniya-darker/80 via-komaniya-darker/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex items-center min-h-[clamp(400px,50vw,650px)]">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight drop-shadow-lg">
            KOMANIYA
            <br />
            <span className="bg-gradient-to-r from-komaniya-lime via-komaniya-green to-komaniya-medium bg-clip-text text-transparent">
              EXPRESS
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed font-medium drop-shadow">
            Serviços Profissionais de Genshin Impact
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link href="/servicos" className="btn-primary text-base flex items-center gap-2 !px-8 !py-3.5">
              Ver Serviços
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="btn-discord text-base flex items-center gap-2 !px-8 !py-3.5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
              </svg>
              Comunidade Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
