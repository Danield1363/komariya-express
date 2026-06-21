"use client";

import { useState } from "react";
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
  const { register } = useAuth();
  const router = useRouter();

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
