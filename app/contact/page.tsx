"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Phone, Mail, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([formData]);

            if (error) throw error;

            setSubmitted(true);
            setFormData({ full_name: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("Error submitting message:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-20">

            <header className="bg-ice/30 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-navy/40 hover:text-sky transition-colors mb-8 text-xs font-black uppercase tracking-widest group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                    <h1 className="text-6xl md:text-8xl font-black text-navy tracking-tighter uppercase leading-[0.9]">
                        Let's <br /><span className="text-sky">Connect</span>
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* Contact Info */}
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-sky">Get in Touch</h3>
                            <h4 className="text-4xl font-black text-navy uppercase leading-tight">We're here to help your business grow.</h4>
                            <p className="text-lg text-navy/60 font-medium">Whether you have a question about a product, shipping, or wholesale inquiries, our team is ready to assist.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4 group">
                                <div className="w-12 h-12 bg-ice rounded-2xl flex items-center justify-center text-sky group-hover:bg-sky group-hover:text-white transition-all">
                                    <Phone size={20} />
                                </div>
                                <h5 className="text-sm font-black uppercase tracking-widest text-navy">Phone & WhatsApp</h5>
                                <p className="text-sm font-bold text-navy/40">+254700622595</p>
                            </div>
                            <div className="space-y-4 group">
                                <div className="w-12 h-12 bg-ice rounded-2xl flex items-center justify-center text-sky group-hover:bg-sky group-hover:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <h5 className="text-sm font-black uppercase tracking-widest text-navy">Email</h5>
                                <p className="text-sm font-bold text-navy/40">johnkihara305@gmail.com</p>
                            </div>
                            <div className="space-y-4 group col-span-1 md:col-span-2">
                                <div className="w-12 h-12 bg-ice rounded-2xl flex items-center justify-center text-sky group-hover:bg-sky group-hover:text-white transition-all">
                                    <MapPin size={20} />
                                </div>
                                <h5 className="text-sm font-black uppercase tracking-widest text-navy">Our Location</h5>
                                <a href="https://maps.app.goo.gl/hghocdA2n5AQceA19" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-sky hover:underline">View on Google Maps →</a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden">
                        {submitted ? (
                            <div className="py-20 text-center space-y-8 animate-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-sky/10 text-sky rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-navy uppercase">Message Sent!</h3>
                                    <p className="text-navy/40 font-medium">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                                </div>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="btn-secondary"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+44 7000 000 000"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                        maxLength={10}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="How can we help you today?"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
