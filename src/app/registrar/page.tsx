"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, Eye, EyeOff, Gem } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, loginWithDiscord, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/perfil");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) { setError("As senhas não coincidem."); setLoading(false); return; }
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); setLoading(false); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Email inválido."); setLoading(false); return; }

    const result = await register(name, email, password);
    if (result.success) {
      router.push("/perfil");
    } else {
      setError(result.error || "Erro ao criar conta.");
    }
    setLoading(false);
  };

  const handleDiscordSignup = async () => {
    setLoading(true);
    setError("");
    const result = await loginWithDiscord();
    if (!result.success) {
      setError(result.error || "Erro ao criar conta com Discord.");
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-green flex items-center justify-center mb-4 glow-green">
            <Gem className="w-8 h-8 text-komaniya-darker" />
          </div>
          <h1 className="text-3xl font-bold text-komaniya-text-bright">Criar Conta</h1>
          <p className="text-komaniya-text-dim mt-2">Registre-se para acompanhar seus pedidos.</p>
        </div>

        <div className="bg-komaniya-card card-border rounded-2xl p-6 sm:p-8">
          <button
            onClick={handleDiscordSignup}
            disabled={loading}
            className="btn-discord w-full flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Criar Conta com Discord
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-komaniya-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-komaniya-card px-3 text-komaniya-text-dim">ou crie com email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-komaniya-danger/10 border border-komaniya-danger/20 rounded-lg p-3 text-sm text-komaniya-danger">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-komaniya-text-bright mb-2">Nome</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-komaniya-text-bright mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-komaniya-text-bright mb-2">Senha</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="input-field pr-10" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-komaniya-text-dim hover:text-komaniya-text transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-komaniya-text-bright mb-2">Confirmar Senha</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" className="input-field" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-komaniya-darker border-t-transparent rounded-full animate-spin" /> : <><UserPlus className="w-4 h-4" /> Criar Conta</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-komaniya-text-dim">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-komaniya-medium hover:text-komaniya-green transition-colors font-medium">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
