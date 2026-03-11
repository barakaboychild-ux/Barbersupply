"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Filter, Search, Clock, ArrowLeft, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/app/components/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const { addToCart, cartCount, setIsCartOpen } = useCart();

    const categories = ["All", "Clippers", "Trimmers", "Shaving products", "Hair products", "Cosmetics", "Accessories"];

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setProducts(data);
                setFilteredProducts(data);
            } else {
                const mockProducts = [
                    { id: 'm1', name: "Gold Series Clipper", price: 199.00, offer_price: 159.00, category: "Clippers", image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80", offer_expiry: new Date(Date.now() + 86400000).toISOString() },
                    { id: 'm2', name: "Matte Finish Pomade", price: 24.00, offer_price: null, category: "Hair products", image_url: "https://images.unsplash.com/photo-1599351431247-f577f9747c9c?w=800&q=80" },
                    { id: 'm3', name: "Titanium Detailer", price: 135.00, offer_price: 110.00, category: "Trimmers", image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80", offer_expiry: new Date(Date.now() + 172800000).toISOString() },
                    { id: 'm4', name: "Beard Wash", price: 22.00, offer_price: null, category: "Hair products", image_url: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=800&q=80" },
                    { id: 'm5', name: "Industrial Barber Cape", price: 45.00, offer_price: 35.00, category: "Accessories", image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80" },
                    { id: 'm6', name: "Carbon Fiber Comb", price: 18.00, offer_price: 12.00, category: "Accessories", image_url: "https://images.unsplash.com/photo-1590540179852-211d6b45e390?w=800&q=80" },
                    { id: 'm7', name: "Professional Scissors", price: 85.00, offer_price: 70.00, category: "Accessories", image_url: "https://images.unsplash.com/photo-1593702295094-172f14293581?w=800&q=80" },
                    { id: 'm8', name: "Texturizing Spray", price: 28.00, offer_price: null, category: "Cosmetics", image_url: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=800&q=80" },
                ];
                setProducts(mockProducts);
                setFilteredProducts(mockProducts);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, products]);

    return (
        <div className="min-h-screen bg-white pt-20">
            <header className="bg-ice/30 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-navy/40 hover:text-sky transition-colors mb-8 text-xs font-black uppercase tracking-widest group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                    <h1 className="text-5xl md:text-7xl font-black text-navy tracking-tighter uppercase mb-6"> Our <span className="text-sky text-stroke">Products</span></h1>
                    <p className="text-lg text-navy/60 font-medium max-w-xl">
                        Professional grade tools and styling essentials for the master barber.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky">Categories</h3>
                            <div className="flex flex-col gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeCategory === cat
                                            ? "bg-navy text-white shadow-lg"
                                            : "text-navy/40 hover:bg-ice hover:text-navy"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-navy rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <h4 className="text-xl font-black uppercase tracking-tight relative z-10">Wholesale?</h4>
                            <p className="text-xs text-white/40 leading-relaxed relative z-10">Get special pricing for your barber shop or salon. Contact us for bulk orders.</p>
                            <a
                                href="https://wa.me/254700622595?text=Hello%20Barber%20%26%20Cosmetic%20Supplies.%20I%60m%20inquiring%20about%20wholesale%20pricing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-sky text-navy rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors relative z-10 flex justify-center items-center"
                            >
                                Contact Sales
                            </a>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1 space-y-12">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-widest text-navy/40">
                                Showing {filteredProducts.length} Results
                            </span>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" />
                                    <input
                                        type="text"
                                        placeholder="Search tools..."
                                        className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-full text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredProducts.map((item) => (
                                <div key={item.id} className="product-card group animate-in fade-in duration-500">
                                    <div className="aspect-[4/5] bg-ice/50 rounded-[2rem] mb-8 overflow-hidden relative">
                                        <div
                                            onClick={() => setSelectedProduct(item)}
                                            className="w-full h-full cursor-pointer"
                                        >
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        {item.offer_price && (
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <div className="bg-sky text-navy px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                    Special Offer
                                                </div>
                                                {item.offer_expiry && (
                                                    <div className="bg-navy/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-bold flex items-center gap-2">
                                                        <Clock size={12} />
                                                        Ends Soon
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item);
                                            }}
                                            className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-sky hover:text-white"
                                        >
                                            <ShoppingCart size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-sky">{item.category}</span>
                                        <h5 className="text-xl font-black text-navy leading-tight uppercase group-hover:text-sky transition-colors">{item.name}</h5>
                                        <div className="flex items-center gap-4 pt-2">
                                            {item.offer_price ? (
                                                <>
                                                    <span className="text-2xl font-black text-navy">Ksh {item.offer_price.toFixed(2)}</span>
                                                    <span className="text-navy/20 text-sm line-through font-bold">Ksh {item.price.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="text-2xl font-black text-navy">Ksh {item.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="py-40 text-center space-y-6">
                                <div className="w-20 h-20 bg-ice rounded-full flex items-center justify-center mx-auto text-sky">
                                    <Filter size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-navy uppercase">No products found</h3>
                                <p className="text-navy/40 font-medium">Try selecting a different category or refining your search.</p>
                                <button onClick={() => setActiveCategory("All")} className="btn-primary">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Product Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden relative z-10 shadow-2xl flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 p-2 bg-navy text-white rounded-full hover:bg-sky transition-colors z-20"
                            >
                                <X size={20} />
                            </button>

                            <div className="md:w-1/2 aspect-square bg-ice">
                                <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="md:w-1/2 p-12 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <span className="text-xs font-black uppercase tracking-[0.4em] text-sky">{selectedProduct.category}</span>
                                    <h2 className="text-4xl font-black text-navy uppercase leading-none tracking-tighter">{selectedProduct.name}</h2>
                                    <p className="text-navy/40 font-medium leading-relaxed">
                                        {selectedProduct.description || "Premium professional grade tool designed for the precision barber. Industrial durability meets exceptional performance."}
                                    </p>
                                    <div className="flex items-center gap-6">
                                        {selectedProduct.offer_price ? (
                                            <>
                                                <span className="text-4xl font-black text-navy tracking-tight text-sky">Ksh {selectedProduct.offer_price}</span>
                                                <span className="text-navy/20 text-xl line-through font-bold">Ksh {selectedProduct.price}</span>
                                            </>
                                        ) : (
                                            <span className="text-4xl font-black text-navy tracking-tight text-sky">Ksh {selectedProduct.price}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-12">
                                    <button
                                        onClick={() => {
                                            addToCart(selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        className="w-full btn-primary py-6 flex items-center justify-center gap-4"
                                    >
                                        Add to Cart
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating Checkout Button */}
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        onClick={() => router.push('/buy')}
                        className="fixed bottom-10 right-10 z-[80] bg-navy text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-6 group hover:bg-sky transition-all transform hover:scale-105"
                    >
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-navy/40">Ready?</span>
                            <span className="text-lg font-black uppercase tracking-tight">Checkout</span>
                        </div>
                        <div className="w-12 h-12 bg-sky text-navy rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                            <ArrowLeft size={20} className="rotate-180" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
