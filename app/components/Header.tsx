"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, ShoppingBag, X, Home, Package, Info, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import { supabase } from "@/lib/supabase";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount, setIsCartOpen } = useCart();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Products', path: '/products', icon: Package },
        { name: 'About', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: Phone }
    ];

    const isBuyPage = pathname === '/buy';

    return (
        <nav className="fixed top-0 w-full z-[70] bg-navy/95 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-white/60 hover:text-sky transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-black tracking-tighter text-white cursor-pointer leading-tight"
                        onClick={() => router.push('/')}
                    >
                        <div className="flex items-center gap-1 md:gap-2 text-xl md:text-2xl">
                            <span className="text-sky">Barber</span>
                            <span className="opacity-40">&</span>
                            <span className="hidden md:inline">Cosmetics Supply</span>
                        </div>
                        <div className="md:hidden text-[10px] uppercase tracking-widest opacity-80 mt-0.5">
                            Cosmetics Supply
                        </div>
                    </motion.h1>
                </div>

                {!pathname.startsWith('/staff') && (
                    <div className="flex items-center gap-7 sm:gap-10">
                        {navItems.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.button
                                    key={item.name}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className={`transition-colors flex flex-col items-center justify-center p-2 lg:p-0 ${pathname === item.path ? "text-sky" : "text-white/60 hover:text-sky"
                                        }`}
                                    onClick={() => router.push(item.path)}
                                >
                                    <Icon size={22} className="lg:hidden" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden lg:block">
                                        {item.name}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-center gap-6">
                    {(!isBuyPage && !pathname.startsWith('/staff')) && (
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-white hover:text-sky transition-colors group"
                        >
                            <ShoppingBag size={24} />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 bg-sky text-navy text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    )}
                </div>
            </div>

            {/* Staff Portal Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60]"
                    >
                        <div
                            className="absolute inset-0"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-20 left-6 bg-navy border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[200px] flex flex-col gap-1"
                        >
                            {pathname.startsWith('/staff') ? (
                                <>
                                    <button
                                        onClick={() => {
                                            router.push('/staff/dashboard?tab=products');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white/60 hover:text-sky hover:bg-white/5 transition-all text-left"
                                    >
                                        Products
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/staff/dashboard?tab=orders');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white/60 hover:text-sky hover:bg-white/5 transition-all text-left"
                                    >
                                        Orders
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push('/staff/dashboard?tab=settings');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white/60 hover:text-sky hover:bg-white/5 transition-all text-left"
                                    >
                                        Settings
                                    </button>
                                    <div className="h-px w-full bg-white/10 my-1" />
                                    <button
                                        onClick={async () => {
                                            await supabase.auth.signOut();
                                            router.push('/');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        router.push('/staff/login');
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white/60 hover:text-sky hover:bg-white/5 transition-all"
                                >
                                    Staff Portal
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
