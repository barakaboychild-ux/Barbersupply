"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Target, ShieldCheck, History, Award, CheckCircle2, AlertCircle } from "lucide-react";

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white pt-20">
            <header className="bg-ice/30 py-32 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-navy/5 -skew-x-12 origin-top-right"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-navy/40 hover:text-sky transition-colors mb-8 text-xs font-black uppercase tracking-widest group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                    <div className="max-w-3xl space-y-8">
                        <h3 className="text-sky font-black uppercase tracking-[0.4em] mb-4 text-xs md:text-sm">About Us</h3>
                        <h1 className="text-6xl md:text-8xl font-black text-navy tracking-tighter uppercase leading-[0.9]">
                            Barber & <br />
                            <span className="text-sky">Cosmetic Supplies</span>
                        </h1>
                        <p className="text-xl text-navy/60 font-medium leading-relaxed italic border-l-4 border-sky pl-8">
                            “We are a Nairobi-based supplier specializing in professional barber and cosmetic products. Our focus is simple — serve Nairobi well before expanding anywhere else.”
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-32 space-y-40">
                {/* Story Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-sky">Our Focus</h3>
                        <h4 className="text-4xl font-black text-navy uppercase leading-tight">Equipping Nairobi's Best Professionals.</h4>
                        <div className="space-y-6 text-navy/60 leading-relaxed font-medium">
                            <p>
                                We understand the pace, standards, and expectations of barbershops and beauty businesses within the city. From CBD to residential estates, professionals need reliable tools, consistent stock, and fair pricing. That’s exactly what we provide.
                            </p>
                            <p>
                                We carefully select products that are practical, durable, and trusted by working professionals. We don’t stock random items just to fill shelves — we stock what actually moves and what delivers results.
                            </p>
                            <p>
                                Right now, we operate exclusively within Nairobi. This allows us to maintain quality control, faster response times, and better service for our customers. As we grow, we plan to expand strategically — but our priority remains building a strong, dependable supply base within Nairobi first.
                            </p>
                        </div>
                    </div>
                    <div className="aspect-square bg-navy rounded-[3rem] overflow-hidden relative shadow-2xl group">
                        <img
                            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80"
                            alt="Barber Shop"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-[12rem] font-black text-white/10 uppercase select-none text-center leading-[0.8]">NBI<br />HQ</div>
                        </div>
                    </div>
                </section>

                {/* Mission & Values */}
                <section className="bg-navy rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-sky/10 blur-[120px] rounded-full"></div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-sky">
                                <Target size={32} />
                            </div>
                            <h4 className="text-2xl font-black uppercase">Nairobi Focus</h4>
                            <p className="text-sm text-white/40 leading-relaxed font-medium">
                                Dedicated Nairobi supply focus. Right now, we operate exclusively within the city to maintain quality control, faster response times, and better local service.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-sky">
                                <ShieldCheck size={32} />
                            </div>
                            <h4 className="text-2xl font-black uppercase">Why Choose Us</h4>
                            <p className="text-sm text-white/40 leading-relaxed font-medium">
                                Consistent product availability, competitive local pricing, and reliable communication and support. Built for barbers and beauty professionals.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-sky">
                                <Award size={32} />
                            </div>
                            <h4 className="text-2xl font-black uppercase">Our Core Range</h4>
                            <p className="text-sm text-white/40 leading-relaxed font-medium">
                                Professional clippers and trimmers, shaving and grooming essentials, hair care products, cosmetic supplies, and barber/beauty accessories.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-sky">
                                <AlertCircle size={32} />
                            </div>
                            <h4 className="text-2xl font-black uppercase">Return Policy</h4>
                            <p className="text-sm text-white/40 leading-relaxed font-medium">
                                To ensure hygiene and quality standards, we enforce a strict <strong className="text-sky">non-refund policy after 24 hours</strong> of delivery. Please inspect all items immediately upon receipt.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Achievements / Stats */}
                <section className="py-20 border-y border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div>
                        <div className="text-5xl font-black text-navy mb-2">100%</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-sky">Nairobi Focus</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-navy mb-2">24h</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-sky">Fast Delivery</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-navy mb-2">Pro</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-sky">Quality Tools</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black text-navy mb-2">Fair</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-sky">Local Pricing</div>
                    </div>
                </section>
            </main>

            {/* Quick CTA */}
            <section className="py-40 px-6 text-center space-y-12">
                <h3 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter">Ready to upgrade your station?</h3>
                <button
                    onClick={() => router.push('/products')}
                    className="btn-primary"
                >
                    Explore Collection
                </button>
            </section>
        </div>
    );
}
