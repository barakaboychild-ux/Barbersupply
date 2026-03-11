"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, LogIn, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function StaffLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Check if user is an approved staff member
      const { data: staffRows, error: staffError } = await supabase
        .from('staff_requests')
        .select('status')
        .eq('email', email)
        .limit(1);

      if (staffError) {
        await supabase.auth.signOut();
        throw new Error("Staff check failed: " + staffError.message);
      }

      const staffData = staffRows?.[0];

      if (!staffData) {
        await supabase.auth.signOut();
        throw new Error("You are not registered as a staff member.");
      }

      if (staffData.status !== 'approved') {
        await supabase.auth.signOut();
        throw new Error(`Your account status is: ${staffData.status}. Please wait for admin approval.`);
      }

      // 3. Redirect to dashboard on success
      router.push('/staff/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials or unauthorized access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-sky/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-lg relative z-10 space-y-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white/40 hover:text-sky transition-colors text-[10px] font-black uppercase tracking-[0.3em] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Site
        </button>

        <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-ice rounded-2xl flex items-center justify-center text-sky">
                <Lock size={32} />
              </div>
              <h2 className="text-4xl font-black text-navy uppercase tracking-tighter">Staff <br /><span className="text-sky text-stroke">Login</span></h2>
              <p className="text-navy/40 font-medium">Log in to manage inventory and products.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-600 leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="name@barbersupply.pro"
                  className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-navy/20 hover:text-sky transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-4 py-5"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={18} />}
                Enter Dashboard
              </button>
            </form>

            <div className="pt-8 border-t border-gray-100 text-center">
              <p className="text-xs font-bold text-navy/40 uppercase tracking-widest">
                Don't have an account? <button onClick={() => router.push('/staff/signup')} className="text-sky hover:underline transition-all ml-1">Sign Up</button>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-sky transition-colors"
          >
            ← Return to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}