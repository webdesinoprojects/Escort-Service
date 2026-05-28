"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/server/actions/admin";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      const res = await adminLogin({ email, password });
      if (res.success) {
        toast.success("Welcome back, administrator!");
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Invalid credentials.");
        toast.error(res.error || "Invalid credentials.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 font-sans select-none">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-1.5 mb-6">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 animate-pulse">
            <circle cx="35" cy="32" r="12" fill="#cf4f41" />
            <path d="M15 75 C 15 50, 55 50, 55 75 Z" fill="#cf4f41" />
            <circle cx="65" cy="32" r="12" fill="#202e4d" />
            <path d="M45 75 C 45 50, 85 50, 85 75 Z" fill="#202e4d" />
          </svg>
          <div className="flex flex-col justify-center leading-none">
            <span className="text-[28px] font-extrabold text-[#202e4d] dark:text-white tracking-tight font-heading">Oklute</span>
            <span className="text-[10px] font-bold text-[#f06e2e] tracking-widest uppercase mt-0.5">Control Center</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground font-heading">Admin Portal</h2>
          <p className="text-muted-foreground text-sm mt-1.5">Sign in to manage listings, locations, and categories.</p>
        </div>

        {error && (
          <div className="w-full bg-destructive/15 border border-destructive/25 text-destructive text-sm px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-muted-foreground/60" />
              <input
                type="email"
                disabled={isPending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@oklute.com"
                className="w-full bg-background border border-border/80 rounded-xl py-3 pl-11 pr-4 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-muted-foreground/60" />
              <input
                type={showPassword ? "text" : "password"}
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-border/80 rounded-xl py-3 pl-11 pr-11 text-foreground text-sm outline-none focus:border-[#cf4f41] focus:ring-1 focus:ring-[#cf4f41] transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#cf4f41] hover:bg-[#b03d31] active:scale-98 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-6 flex items-center justify-center gap-2 cursor-pointer font-heading tracking-wide"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
