"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Eye, EyeOff, Gem, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const { login, resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    if (result.success) {
      router.push("/perfil");
    } else {
      setError(result.error || "Erro ao fazer login.");
    }
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await resetPassword(resetEmail);
    if (result.success) {
      setResetMsg("Uma nova senha foi enviada para seu email (verifique a caixa de entrada).");
    } else {
      setResetMsg(result.error || "Erro ao redefinir senha.");
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-green flex items-center justify-center mb-4 glow-green">
            <Gem className="w-8 h-8 text-komaniya-darker" />
          </div>
          <h1 className="text-3xl font-bold text-komaniya-text-bright">Entrar</h1>
          <p className="text-komaniya-text-dim mt-2">Acesse sua conta para acompanhar seus pedidos.</p>
        </div>

        <div className="bg-komaniya-card card-border rounded-2xl p-6 sm:p-8">
          {showReset ? (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="flex items-center gap-2 text-komaniya-medium mb-2">
                <KeyRound className="w-5 h-5" />
                <span className="text-sm font-semibold">Recuperar Senha</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-komaniya-text-bright mb-2">Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="input-field"
                  required
                />
              </div>
              {resetMsg && (
                <div className="bg-komaniya-medium/10 border border-komaniya-medium/20 rounded-lg p-3 text-sm text-komaniya-medium">
                  {resetMsg}
                </div>
              )}
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <KeyRound className="w-4 h-4" /> Enviar Nova Senha
              </button>
              <button type="button" onClick={() => setShowReset(false)} className="btn-secondary w-full text-sm">
                Voltar ao Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-komaniya-danger/10 border border-komaniya-danger/20 rounded-lg p-3 text-sm text-komaniya-danger">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-komaniya-text-bright mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-komaniya-text-bright mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-komaniya-text-dim hover:text-komaniya-text transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button type="button" onClick={() => { setShowReset(true); setResetMsg(""); }} className="text-xs text-komaniya-medium hover:text-komaniya-green transition-colors">
                  Esqueceu a senha?
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-komaniya-darker border-t-transparent rounded-full animate-spin" /> : <><LogIn className="w-4 h-4" /> Entrar</>}
              </button>
            </form>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-komaniya-text-dim">
              Não tem uma conta?{" "}
              <Link href="/registrar" className="text-komaniya-medium hover:text-komaniya-green transition-colors font-medium">Criar conta</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
