"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Package, Clock, CheckCircle2, AlertCircle, ArrowLeft, MapPin, Phone, User, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

function TrackOrderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get('id');

    const [orderId, setOrderId] = useState(orderIdParam || "");
    const [order, setOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderIdParam) {
            handleTrack(orderIdParam);
        }
    }, [orderIdParam]);

    const handleTrack = async (id: string) => {
        if (!id) return;
        setLoading(true);
        setError(null);
        setOrder(null);
        setOrderItems([]);

        try {
            // Check if it's a short ID (8 chars) or a UUID
            let query = supabase.from('orders').select('*');
            
            if (id.trim().length === 8) {
                query = query.eq('short_id', id.trim().toUpperCase());
            } else {
                query = query.eq('id', id.trim());
            }

            const { data: orderData, error: fetchError } = await query.single();

            if (fetchError) {
                if (fetchError.code === 'PGRST116') {
                    throw new Error("Order not found. Please verify the ID.");
                }
                throw fetchError;
            }

            if (orderData) {
                setOrder(orderData);
                const { data: itemsData } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', orderData.id);
                if (itemsData) setOrderItems(itemsData);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching your order.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'pending': return 1;
            case 'processing': return 2;
            case 'delivered': return 3;
            case 'cancelled': return 0;
            default: return 1;
        }
    };

    const statusSteps = [
        { label: 'Order Placed', status: 'pending', icon: Clock },
        { label: 'Processing', status: 'processing', icon: Package },
        { label: 'Delivered', status: 'delivered', icon: CheckCircle2 },
    ];

    const currentStep = order ? getStatusStep(order.status) : 0;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="space-y-4">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-navy/40 hover:text-sky transition-colors mb-8 text-[10px] font-black uppercase tracking-widest group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-none">
                        Track Your <br /><span className="text-sky text-stroke">Order</span>
                    </h1>
                    <p className="text-navy/40 font-medium">Enter your Order ID to see real-time delivery status.</p>
                </header>

                {/* Search Bar */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={20} />
                            <input
                                type="text"
                                placeholder="PASTE ORDER ID HERE (e.g. 550e8400-e29b-41d4-a716-446655440000)"
                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleTrack(orderId)}
                            />
                        </div>
                        <button
                            onClick={() => handleTrack(orderId)}
                            disabled={loading}
                            className="bg-navy text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sky transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? "Searching..." : "Track Status"}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 flex flex-col items-center justify-center gap-4 text-navy/40"
                        >
                            <div className="w-12 h-12 border-4 border-ice border-t-sky rounded-full animate-spin" />
                            <span className="font-black uppercase tracking-widest text-[10px]">Retrieving Order Data...</span>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-red-50 border border-red-100 p-8 rounded-[2rem] flex items-center gap-6 text-red-600"
                        >
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                <AlertCircle size={24} />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black uppercase tracking-tight">Search Failed</p>
                                <p className="text-sm font-medium opacity-80">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Status Stepper */}
                            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100">
                                {order.status === 'cancelled' ? (
                                    <div className="text-center py-4 space-y-4">
                                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                                            <X size={40} />
                                        </div>
                                        <h3 className="text-2xl font-black text-navy uppercase tracking-tight">Order Cancelled</h3>
                                        <p className="text-navy/40 font-medium">This order has been cancelled. Please contact support if you have questions.</p>
                                    </div>
                                ) : (
                                    <div className="relative flex justify-between items-center max-w-2xl mx-auto">
                                        {/* Progress Line */}
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0" />
                                        <div 
                                            className="absolute top-1/2 left-0 h-1 bg-sky -translate-y-1/2 z-0 transition-all duration-1000"
                                            style={{ width: `${((currentStep - 1) / (statusSteps.length - 1)) * 100}%` }}
                                        />

                                        {statusSteps.map((step, idx) => {
                                            const Icon = step.icon;
                                            const isActive = currentStep >= idx + 1;
                                            return (
                                                <div key={idx} className="relative z-10 flex flex-col items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-sky text-navy shadow-lg shadow-sky/20' : 'bg-white text-navy/20 border-4 border-gray-100'}`}>
                                                        <Icon size={24} />
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-navy' : 'text-navy/20'}`}>
                                                            {step.label}
                                                        </span>
                                                        {isActive && idx + 1 === currentStep && (
                                                            <span className="text-[8px] font-bold text-sky animate-pulse uppercase tracking-[0.2em] mt-1">Current State</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-navy p-10 rounded-[3rem] text-white space-y-8 shadow-2xl">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky">Delivery Info</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-sky shrink-0">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Customer Name</p>
                                                <p className="font-black uppercase tracking-tight">{order.customer_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-sky shrink-0">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Contact Phone</p>
                                                <p className="font-bold">{order.customer_phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-sky shrink-0">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Address</p>
                                                <p className="text-sm font-bold text-white/60 leading-relaxed">{order.delivery_address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8 flex flex-col">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky">Sumarry</h3>
                                    <div className="flex-1 space-y-4">
                                        {orderItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-ice rounded-xl flex items-center justify-center text-sky text-[10px] font-black">{item.quantity}x</div>
                                                    <span className="text-xs font-black text-navy uppercase">{item.product_name}</span>
                                                </div>
                                                <span className="text-xs font-bold text-navy/40">Ksh {(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                                        <span className="text-lg font-black text-navy uppercase tracking-tighter">Total Paid</span>
                                        <span className="text-3xl font-black text-sky">Ksh {parseFloat(order.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!order && !loading && !orderIdParam && (
                    <div className="py-20 text-center space-y-6 opacity-30">
                        <ShoppingBag size={64} className="mx-auto text-navy" />
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-navy">Enter your details above to begin tracking</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TrackOrder() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center">
            <Loader2 className="animate-spin text-sky" size={48} />
        </div>}>
            <TrackOrderContent />
        </Suspense>
    );
}

import { Loader2 } from "lucide-react";
