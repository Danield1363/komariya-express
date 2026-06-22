import { Product } from "@/types";

export const products: Product[] = [
  { id: "exp-mondstadt", name: "Mondstadt", price: 30.0, category: "exploracao", region: "Mondstadt", description: "Exploração completa de Mondstadt", available: true },
  { id: "exp-espinha-dragao", name: "Espinha do Dragão", price: 32.0, category: "exploracao", region: "Mondstadt", description: "Exploração completa da Espinha do Dragão", available: true },
  { id: "exp-liyue", name: "Liyue", price: 40.0, category: "exploracao", region: "Liyue", description: "Exploração completa de Liyue", available: true },
  { id: "exp-despenhadeiro", name: "Despenhadeiro + Minas Subterrâneas", price: 60.0, category: "exploracao", region: "Liyue", description: "Exploração completa do Despenhadeiro e Minas", available: true },
  { id: "exp-inazuma", name: "Inazuma", price: 70.0, category: "exploracao", region: "Inazuma", description: "Exploração completa de Inazuma", available: true },
  { id: "exp-enkanomiya", name: "Enkanomiya", price: 60.0, category: "exploracao", region: "Inazuma", description: "Exploração completa de Enkanomiya", available: true },
  { id: "exp-sumeru-floresta", name: "Sumeru Floresta", price: 90.0, category: "exploracao", region: "Sumeru", description: "Exploração completa da Floresta de Sumeru", available: true },
  { id: "exp-sumeru-deserto", name: "Sumeru Deserto", price: 95.0, category: "exploracao", region: "Sumeru", description: "Exploração completa do Deserto de Sumeru", available: true },
  { id: "exp-fontaine", name: "Fontaine", price: 85.0, category: "exploracao", region: "Fontaine", description: "Exploração completa de Fontaine", available: true },
  { id: "exp-mar-antigo", name: "Mar Antigo", price: 55.0, category: "exploracao", region: "Fontaine", description: "Exploração completa da Mar Antigo", available: true },
  { id: "exp-vale-chenyu", name: "Vale Chenyu", price: 50.0, category: "exploracao", region: "Liyue", description: "Exploração completa do Vale Chenyu", available: true },
  { id: "exp-natlan", name: "Natlan", price: 75.0, category: "exploracao", region: "Natlan", description: "Exploração completa de Natlan", available: true },
  { id: "exp-atocpan", name: "Atocpan", price: 50.0, category: "exploracao", region: "Natlan", description: "Exploração completa de Atocpan", available: true },
  { id: "exp-resort-brisa", name: "Resort da Brisa", price: 55.0, category: "exploracao", region: "Natlan", description: "Exploração completa do Resort da Brisa", available: true },
  { id: "exp-nodkrai", name: "Nodkrai", price: 135.0, category: "exploracao", region: "Nodkrai", description: "Exploração completa de Nodkrai", available: true },
  { id: "exp-montanha-sagrada", name: "Montanha Sagrada", price: 55.0, category: "exploracao", region: "Liyue", description: "Exploração completa da Montanha Sagrada", available: true },
  { id: "exp-pico-repouso", name: "Pico do Repouso", price: 30.0, category: "exploracao", region: "Mondstadt", description: "Exploração completa do Pico do Repouso", available: true },
  { id: "exp-templo-espaco", name: "Templo do Espaço", price: 40.0, category: "exploracao", region: "Liyue", description: "Exploração completa do Templo do Espaço", available: true },

  { id: "eg-abismo", name: "Abismo (por piso)", price: 5.5, category: "endgame", description: "Limpeza de piso do Abismo", available: true },
  { id: "eg-teatro-facil", name: "Teatro Fácil", price: 8.0, category: "endgame", description: "Teatro Fácil completo", available: true },
  { id: "eg-teatro-medio", name: "Teatro Médio", price: 10.0, category: "endgame", description: "Teatro Médio completo", available: true },
  { id: "eg-teatro-dificil", name: "Teatro Difícil", price: 12.0, category: "endgame", description: "Teatro Difícil completo", available: true },
  { id: "eg-teatro-visionario", name: "Teatro Visionário", price: 15.0, category: "endgame", description: "Teatro Visionário completo", available: true },
  { id: "eg-teatro-lunar", name: "Teatro Lunar", price: 17.5, category: "endgame", description: "Teatro Lunar completo", available: true },
  { id: "eg-confronto-abissal", name: "Confronto Abissal Completo", price: 15.0, category: "endgame", description: "Confronto Abissal completo", available: true },
  { id: "eg-rastro", name: "Rastro", price: 4.0, category: "endgame", description: "Serviço de Rastro", available: true },
  { id: "eg-pacote-3", name: "Pacote dos Três End Games", price: 35.0, category: "endgame", description: "Pacote completo dos 3 End Games", available: true },

  { id: "ct-ascensao-personagem", name: "Ascensão de Personagem 1~90", price: 20.0, category: "conta", description: "Ascensão completa do personagem do nível 1 ao 90", available: true },
  { id: "ct-talentos-3", name: "UP de 3 Talentos (1 ao 10)", price: 32.0, category: "conta", description: "3 talentos do nível 1 ao 10", available: true },
  { id: "ct-talentos-1", name: "UP de 1 Talento (1 ao 10)", price: 12.0, category: "conta", description: "1 talento do nível 1 ao 10", available: true },
  { id: "ct-ascensao-arma", name: "Ascensão de Arma 1~90", price: 20.0, category: "conta", description: "Ascensão completa da arma do nível 1 ao 90", available: true },
  { id: "ct-build-basica", name: "Build Básica", price: 10.0, category: "conta", description: "Artefatos T5 nível 20 com peças medianas", available: true },
  { id: "ct-build-excelente", name: "Build Excelente", price: 25.0, category: "conta", description: "Artefatos T5 nível 20 com peças excelentes", available: true },
];

export const testimonials = [
  { id: 1, name: "Lucas M.", avatar: "LM", rating: 5, text: "Serviço excelente! Consegui mais de 60 giros em menos de uma semana. Recomendo demais!" },
  { id: 2, name: "Ana P.", avatar: "AP", rating: 5, text: "Muito profissional. O farm foi rápido e seguro. Já indiquei para vários amigos." },
  { id: 3, name: "Pedro H.", avatar: "PH", rating: 5, text: "Melhor preço do mercado e serviço de qualidade. Voltarei a comprar com certeza." },
  { id: 4, name: "Maria S.", avatar: "MS", rating: 4, text: "Bom atendimento pelo Discord. O processo foi transparente do início ao fim." },
  { id: 5, name: "Rafael O.", avatar: "RO", rating: 5, text: "Já comprei 3 vezes e sempre superou minhas expectativas. Time muito competente!" },
  { id: 6, name: "Juliana F.", avatar: "JF", rating: 5, text: "Farm de primogemas impecável. Consegui meu personagem sonhado!" },
];

export const faqItems = [
  { id: 1, question: "É seguro usar o serviço?", answer: "Sim! Utilizamos métodos seguros e sigilosos. Nossa equipe é treinada para manter sua conta segura durante todo o processo." },
  { id: 2, question: "Como funciona o processo de farm?", answer: "Após a compra, nossa equipe entra em contato pelo Discord para coordenar o acesso à conta. O farm é realizado de forma manual e segura." },
  { id: 3, question: "Quanto tempo leva para completar o farm?", answer: "O tempo varia conforme o pacote escolhido. Geralmente leva de 1 a 5 dias úteis para completar." },
  { id: 4, question: "Quais formas de pagamento são aceitas?", answer: "Atualmente aceitamos pagamento via Discord. Em breve teremos integração com Mercado Pago, PIX, Stripe e PayPal." },
  { id: 5, question: "Posso acompanhar o progresso?", answer: "Sim! Você receberá atualizações periódicas pelo Discord sobre o progresso do farm." },
  { id: 6, question: "E se minha conta for banida?", answer: "Nossos métodos são seguros e manuais, minimizando qualquer risco. Em caso de problemas, oferecemos reembolso total." },
];

export const DISCORD_LINK = "https://discord.gg/8WWNGs8hkD";
