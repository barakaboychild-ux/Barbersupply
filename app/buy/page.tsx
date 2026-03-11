"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, CheckCircle2, Loader2, Smartphone, Banknote, Building2 } from "lucide-react";
import { useCart } from "../components/CartContext";
import { supabase } from "@/lib/supabase";

type PaymentMethod = 'delivery' | 'mpesa_manual';

export default function BuyPage() {
    const router = useRouter();
    const { cart, totalPrice, clearCart, setIsCartOpen } = useCart();
    const [isOrdered, setIsOrdered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('delivery');
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address: ''
    });

    const MPESA_MANUAL_NUMBER = '0700622595';

    const handleOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: formData.full_name,
                    customer_phone: formData.phone,
                    delivery_address: formData.address,
                    total_amount: totalPrice,
                    payment_method: paymentMethod,
                    status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: typeof item.id === 'string' && !item.id.startsWith('m') ? item.id : null,
                product_name: item.name,
                quantity: item.quantity,
                price_at_purchase: item.offer_price ?? item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            setIsOrdered(true);
            setTimeout(() => clearCart(), 100);
        } catch (error: any) {
            console.error("Order error:", error);
            alert("Failed to place order: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (isOrdered) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-sky/20 rounded-full flex items-center justify-center mx-auto text-sky">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-navy uppercase tracking-tighter">Order Placed!</h1>
                        <p className="text-navy/60 font-medium leading-relaxed">
                            Thank you for your purchase! We've received your order and will contact you shortly to confirm delivery details.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            clearCart();
                            router.push('/');
                        }}
                        className="btn-primary w-full"
                    >
                        Return to Home
                    </button>
                    <p className="text-[10px] font-black uppercase tracking-widest text-navy/20">Order ID: #{Math.floor(Math.random() * 1000000)}</p>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 space-y-8">
                <div className="w-20 h-20 bg-ice rounded-full flex items-center justify-center text-sky/40">
                    <ShoppingBag size={40} />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-navy uppercase">Your cart is empty</h2>
                    <p className="text-navy/40 font-medium">Please add some items to your cart first.</p>
                </div>
                <button onClick={() => router.push('/products')} className="btn-primary">Browse Products</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-20">
            <main className="max-w-7xl mx-auto px-6 py-20">
                <button
                    onClick={() => {
                        router.back();
                        setIsCartOpen(true);
                    }}
                    className="flex items-center gap-2 text-navy/40 hover:text-sky transition-colors mb-12 text-xs font-black uppercase tracking-widest group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Cart
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Order Summary */}
                    <div className="lg:col-span-7 space-y-12">
                        <header>
                            <h1 className="text-5xl font-black text-navy uppercase tracking-tighter mb-4">Finalize <span className="text-sky text-stroke">Order</span></h1>
                            <p className="text-navy/40 font-medium uppercase tracking-widest text-[10px]">Secure Premium Checkout</p>
                        </header>

                        <div className="space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-sky">Order Summary</h3>
                            <div className="divide-y divide-gray-100 bg-gray-50/50 rounded-[2.5rem] px-8 py-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="py-6 flex justify-between items-center group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-20 bg-ice rounded-xl overflow-hidden shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-navy uppercase">{item.name}</h4>
                                                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-navy">Ksh {((item.offer_price ?? item.price) * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                <div className="py-8 pt-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold text-navy/40 uppercase tracking-widest">Shipping</span>
                                        <span className="text-xs font-black text-navy lowercase">Free Delivery</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-black text-navy uppercase tracking-tighter leading-none">Total</span>
                                        <span className="text-4xl font-black text-sky tracking-tighter leading-none">Ksh {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-ice/30 rounded-3xl space-y-4">
                                <Truck size={24} className="text-sky" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-navy">Premium Delivery</h4>
                                <p className="text-[10px] text-navy/40 font-bold leading-relaxed">Same day delivery within Nairobi. 2-3 business days countrywide.</p>
                            </div>
                            <div className="p-8 bg-ice/30 rounded-3xl space-y-4">
                                <ShieldCheck size={24} className="text-sky" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-navy">Quality Guaranteed</h4>
                                <p className="text-[10px] text-navy/40 font-bold leading-relaxed">100% genuine industrial tools with valid manufacturer warranty.</p>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="lg:col-span-5">
                        <div className="p-10 bg-navy rounded-[3rem] text-white shadow-2xl space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-sky/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                            <div className="space-y-6 relative z-10">
                                <h3 className="text-xl font-black uppercase tracking-tight">Delivery Details</h3>
                                <form onSubmit={handleOrder} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-sky/60 ml-4">Full Name</label>
                                        <input
                                            required
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full bg-white/5 border-none rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-white/20 focus:ring-2 focus:ring-sky/40 transition-all outline-none"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-sky/60 ml-4">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            maxLength={10}
                                            className="w-full bg-white/5 border-none rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-white/20 focus:ring-2 focus:ring-sky/40 transition-all outline-none"
                                            placeholder="07XX XXX XXX"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-sky/60 ml-4">Delivery Address</label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-white/5 border-none rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-white/20 focus:ring-2 focus:ring-sky/40 transition-all outline-none resize-none"
                                            placeholder="Where should we send your tools?"
                                        ></textarea>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="pt-4 space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky">Payment Method</h4>

                                        {/* Option 1: Payment on Delivery */}
                                        <div
                                            onClick={() => setPaymentMethod('delivery')}
                                            className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'delivery'
                                                ? 'bg-sky/10 border-sky/40'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'delivery' ? 'border-sky' : 'border-white/20'}`}>
                                                {paymentMethod === 'delivery' && <div className="w-2.5 h-2.5 bg-sky rounded-full" />}
                                            </div>
                                            <Banknote size={20} className="text-sky shrink-0" />
                                            <div>
                                                <h5 className="text-[10px] font-black uppercase tracking-widest">Payment on Delivery</h5>
                                                <p className="text-[9px] text-white/40 font-bold">Cash or M-Pesa accepted at your door.</p>
                                            </div>
                                        </div>

                                        {/* Option 2: Manual M-Pesa */}
                                        <div
                                            onClick={() => setPaymentMethod('mpesa_manual')}
                                            className={`rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'mpesa_manual'
                                                ? 'bg-sky/10 border-sky/40'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 p-5">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'mpesa_manual' ? 'border-sky' : 'border-white/20'}`}>
                                                    {paymentMethod === 'mpesa_manual' && <div className="w-2.5 h-2.5 bg-sky rounded-full" />}
                                                </div>
                                                <Smartphone size={20} className="text-green-400 shrink-0" />
                                                <div>
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest">Pay via M-Pesa</h5>
                                                    <p className="text-[9px] text-white/40 font-bold">Send to our M-Pesa number.</p>
                                                </div>
                                            </div>
                                            {paymentMethod === 'mpesa_manual' && (
                                                <div className="px-5 pb-5">
                                                    <div className="p-5 bg-white/5 rounded-xl space-y-3 border border-white/5">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">M-Pesa Number</span>
                                                            <span className="text-lg font-black text-sky tracking-wider">{MPESA_MANUAL_NUMBER}</span>
                                                        </div>
                                                        <p className="text-[9px] text-white/30 font-bold leading-relaxed pt-2 border-t border-white/5">
                                                            Go to M-Pesa → Send Money → Enter {MPESA_MANUAL_NUMBER} → Amount → PIN → Send.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 bg-sky text-navy rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-white transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                Processing...
                                            </>
                                        ) : (
                                            "Place Order"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
