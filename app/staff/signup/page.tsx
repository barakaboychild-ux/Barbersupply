"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Send, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function StaffSignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.full_name,
                    }
                }
            });

            if (authError) throw authError;

            // 2. Insert into staff_requests table
            const { error: dbError } = await supabase
                .from('staff_requests')
                .insert([{
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone,
                    status: 'pending'
                }]);

            if (dbError) throw dbError;

            setSubmitted(true);
        } catch (error: any) {
            console.error("Error submitting staff request:", error);
            alert(error.message || "Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>

            <div className="w-full max-w-xl relative z-10 space-y-8">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-white/40 hover:text-sky transition-colors text-[10px] font-black uppercase tracking-[0.3em] group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Site
                </button>

                <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
                    {submitted ? (
                        <div className="py-12 text-center space-y-10 animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-sky/10 text-sky rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 size={48} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-navy uppercase leading-tight">Request Received</h3>
                                <p className="text-navy/40 font-medium leading-relaxed">
                                    Your application for staff access has been submitted. An administrator will review your request and you will be notified via email once approved.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/')}
                                className="btn-primary w-full"
                            >
                                Return Home
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-ice rounded-2xl flex items-center justify-center text-sky">
                                    <UserPlus size={32} />
                                </div>
                                <h2 className="text-4xl font-black text-navy uppercase tracking-tighter">Staff <br /><span className="text-sky text-stroke">Application</span></h2>
                                <p className="text-navy/40 font-medium">Apply for access to the professional inventory management system.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Work Email</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="email@barbersupply.pro"
                                        className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+44 7000 000 000"
                                        className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                        maxLength={10}
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
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                                    Submit Application
                                </button>
                            </form>

                            <div className="pt-8 border-t border-gray-100 text-center">
                                <p className="text-xs font-bold text-navy/40 uppercase tracking-widest">
                                    Already have an account? <button onClick={() => router.push('/staff/login')} className="text-sky hover:underline transition-all ml-1">Log In</button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
