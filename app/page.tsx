"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, CheckCircle2, ShoppingCart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useCart } from "./components/CartContext";

const heroSlides = [
  {
    bg: "/images/hero_barber_bg.png",
    badge: "Professional Barber Tools",
    title: ["Premium", "Barber", "Tools"],
    highlight: 1,
    desc: "Elevate your craft with industrial-grade clippers, trimmers, and precision tools engineered for the modern barber.",
  },
  {
    bg: "/images/hero_cosmetics_bg.png",
    badge: "Beauty & Cosmetics",
    title: ["Quality", "Cosmetics", "Supply"],
    highlight: 1,
    desc: "Discover our curated collection of premium beauty products, skincare, and salon-quality cosmetics for professionals.",
  },
  {
    bg: "/images/hero_barber_bg.png",
    badge: "Trusted by Professionals",
    title: ["Your", "Success", "Starts Here"],
    highlight: 1,
    desc: "Hundreds of professionals trust us for reliable, durable tools that deliver flawless results every single time.",
  },
  {
    bg: "/images/hero_cosmetics_bg.png",
    badge: "Same Day Delivery",
    title: ["Fast", "Reliable", "Service"],
    highlight: 0,
    desc: "Same day delivery in Nairobi, 2-3 business days countrywide. Your tools, delivered when you need them.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(4);

      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts([
          { id: 1, name: "Gold Series Clipper", price: 199.00, offer_price: 159.00, category: "Clippers", image_url: "/images/hero_products_composite.png" },
          { id: 2, name: "Matte Finish Pomade", price: 24.00, offer_price: null, category: "Hair products", image_url: "https://images.unsplash.com/photo-1599351431247-f577f9747c9c?w=800&q=80" },
          { id: 3, name: "Titanium Detailer", price: 135.00, offer_price: 110.00, category: "Trimmers", image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80" },
          { id: 4, name: "Beard Wash", price: 22.00, offer_price: null, category: "Hair products", image_url: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=800&q=80" },
        ]);
      }
      setLoading(false);
    }
    fetchFeaturedProducts();
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pt-[140px] sm:pt-20">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-navy">
        {/* Permanent background layer to prevent blank screen during transitions */}
        <div className="absolute inset-0 bg-navy z-0" />

        {/* Transitioning Background Images - crossfade, no blank */}
        {heroSlides.map((s, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{ zIndex: index === currentSlide ? 0 : -1 }}
          >
            <img
              src={s.bg}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/30" />
          </motion.div>
        ))}

        {/* Floating Ambient Elements */}
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-10 w-80 h-80 bg-sky/20 blur-[120px] rounded-full z-[1]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-10 w-60 h-60 bg-sky/10 blur-[100px] rounded-full z-[1]"
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-32 w-full">
          <div className="max-w-2xl">
            <div className="grid">
              <AnimatePresence>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="[grid-area:1/1] space-y-8"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.05 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-sky rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10"
                  >
                    <Star size={12} fill="currentColor" />
                    {slide.badge}
                  </motion.div>

                  {/* Title */}
                  <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                    {slide.title.map((word, i) => (
                      <span key={i}>
                        {i === slide.highlight ? (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.02, duration: 0.05 }}
                            className="text-sky"
                          >
                            {word}
                          </motion.span>
                        ) : (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.02, duration: 0.05 }}
                          >
                            {word}
                          </motion.span>
                        )}
                        <br />
                      </span>
                    ))}
                  </h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.05 }}
                    className="text-lg md:text-xl text-white/50 font-medium max-w-lg leading-relaxed"
                  >
                    {slide.desc}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Static CTA Button (outside transitions) */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="px-8 py-4 bg-sky text-navy rounded-full text-xs font-black uppercase tracking-[0.15em] shadow-xl hover:bg-white transition-all transform hover:scale-105 flex items-center gap-3 group"
                onClick={() => router.push('/products')}
              >
                Shop Collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>


        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-12 sm:py-32 px-6 bg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky/10 blur-[100px] -z-0"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12 relative z-10">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-sky"
          >
            Why Choose Us
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-5xl font-black tracking-tight leading-tight"
          >
            The standard for professional barbering and elite cosmetics.
          </motion.p>

          <div className="grid grid-cols-3 gap-4 sm:gap-12 pt-8 sm:pt-12">
            {[
              { title: "Precision", desc: "Surgical-grade steel blades." },
              { title: "Durability", desc: "Built for busy shops." },
              { title: "Innovation", desc: "Leading tech in tools." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="space-y-2 sm:space-y-4 group flex flex-col items-center"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center text-sky group-hover:bg-sky group-hover:text-navy transition-all">
                  <CheckCircle2 size={16} className="sm:hidden" />
                  <CheckCircle2 size={24} className="hidden sm:block" />
                </div>
                <h4 className="text-[10px] sm:text-lg font-black uppercase tracking-wider">{feature.title}</h4>
                <p className="text-[8px] sm:text-sm text-white/40 leading-relaxed max-w-[100px] sm:max-w-none">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="py-12 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-sky">Featured Products</h3>
              <h4 className="text-4xl font-black text-navy uppercase">Bestsellers</h4>
            </motion.div>
            <motion.button
              whileHover={{ x: 5 }}
              className="text-xs font-black uppercase tracking-widest text-navy/40 hover:text-sky transition-colors flex items-center gap-2 group"
              onClick={() => router.push('/products')}
            >
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10"
          >
            {products.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeIn}
                className="product-card group"
              >
                <div className="aspect-[4/5] bg-ice/50 rounded-2xl sm:rounded-[2rem] mb-3 sm:mb-8 overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {item.offer_price && (
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-sky text-navy px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl">
                      Offer
                    </div>
                  )}
                  <button
                    onClick={() => {
                      addToCart(item);
                    }}
                    className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-navy shadow-xl opacity-100 sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 hover:bg-sky hover:text-white"
                  >
                    <ShoppingCart size={14} className="sm:hidden" />
                    <ShoppingCart size={20} className="hidden sm:block" />
                  </button>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-sky">{item.category}</span>
                  <h5 className="text-sm sm:text-xl font-black text-navy leading-tight uppercase group-hover:text-sky transition-colors">{item.name}</h5>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1 sm:pt-2">
                    {item.offer_price ? (
                      <>
                        <span className="text-base sm:text-2xl font-black text-navy">Ksh {item.offer_price}</span>
                        <span className="text-navy/20 text-[10px] sm:text-sm line-through font-bold">Ksh {item.price}</span>
                      </>
                    ) : (
                      <span className="text-base sm:text-2xl font-black text-navy">Ksh {item.price}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- WHATSAPP FLOATING BUTTON --- */}
      <a
        href="https://wa.me/254700622595?text=Hello%20Barber%20%26%20Cosmetic%20Supplies.%20I%60m%20inquiring%20on%20..."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[80] bg-[#25D366] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform group border border-white/20 w-max"
      >
        <span className="font-bold tracking-wide">Chat with us</span>
        <MessageCircle size={24} />
      </a>
    </div>
  );
}