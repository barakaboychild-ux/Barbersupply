"use client";
import React from "react";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function CartPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity, totalPrice, cartCount } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-out">
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-navy text-white">
                            <div className="flex items-center gap-4">
                                <ShoppingBag size={24} className="text-sky" />
                                <h2 className="text-xl font-black uppercase tracking-tight">Your Cart</h2>
                                <span className="bg-sky text-navy text-[10px] font-black px-2 py-0.5 rounded-full">{cartCount}</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-ice rounded-full flex items-center justify-center text-sky/40">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-navy uppercase">Cart is empty</h3>
                                        <p className="text-navy/40 font-medium">Your premium tools are waiting for you.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="btn-secondary"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="w-24 h-32 bg-ice/50 rounded-2xl shrink-0 overflow-hidden relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-black text-navy uppercase leading-tight group-hover:text-sky transition-colors">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-navy/20 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-lg font-black text-navy">
                                                    Ksh {(item.offer_price ?? item.price).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center gap-4 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="text-navy/40 hover:text-sky transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="text-navy/40 hover:text-sky transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="text-xs font-bold text-navy/20 uppercase tracking-widest">
                                                    Item Total: Ksh {((item.offer_price ?? item.price) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="px-8 py-10 border-t border-gray-100 bg-gray-50 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-navy/40">
                                        <span className="text-sm font-bold uppercase tracking-widest">Subtotal</span>
                                        <span className="text-sm font-bold">Ksh {totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-navy/40">
                                        <span className="text-sm font-bold uppercase tracking-widest">Shipping</span>
                                        <span className="text-sm font-bold italic">Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-navy/5">
                                        <span className="text-xl font-black text-navy uppercase tracking-tight">Total</span>
                                        <span className="text-2xl font-black text-navy">Ksh {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        onClose();
                                        router.push('/buy');
                                    }}
                                    className="w-full btn-primary flex items-center justify-center gap-4 group"
                                >
                                    Place Order
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <p className="text-[10px] text-center font-bold text-navy/20 uppercase tracking-widest">
                                    Secure Professional Checkout • 100% Guaranteed Quality
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
