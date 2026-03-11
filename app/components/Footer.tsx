"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
    const router = useRouter();
    const [socialLinks, setSocialLinks] = useState({
        social_instagram: '',
        social_facebook: '',
        social_twitter: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('store_settings').select('*');
            if (data) {
                const links = { ...socialLinks };
                data.forEach(item => {
                    if (item.key in links) {
                        links[item.key as keyof typeof links] = item.value;
                    }
                });
                setSocialLinks(links);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="bg-navy pt-32 pb-12 px-6 text-white border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 mb-32">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
                            Barber <span className="text-sky">&</span> Cosmetics Supply
                        </h2>
                        <p className="text-sm text-white/40 leading-relaxed font-medium">
                            Premium grade industrial tools and professional grooming essentials for the modern master barber. Established 1994.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Instagram, link: socialLinks.social_instagram },
                                { Icon: Facebook, link: socialLinks.social_facebook },
                                { Icon: Twitter, link: socialLinks.social_twitter }
                            ].map(({ Icon, link }, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (link) {
                                            window.open(link.startsWith('http') ? link : `https://${link}`, '_blank');
                                        } else {
                                            alert("This social media link hasn't been configured yet!\nStaff can add it in the Settings dashboard.");
                                        }
                                    }}
                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/5 hover:bg-sky hover:text-navy cursor-pointer"
                                >
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky">Links</h4>
                        <ul className="space-y-4">
                            {['Home', 'Products', 'About', 'Contact'].map((item) => (
                                <li key={item}>
                                    <button
                                        onClick={() => router.push(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                                        className="text-sm font-bold text-white/40 hover:text-sky transition-colors uppercase tracking-widest"
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky">Contact Info</h4>
                        <ul className="space-y-6">
                            <li className="flex items-center gap-4 text-white/40">
                                <Phone size={16} className="text-sky" />
                                <span className="text-xs font-bold">+254700622595</span>
                            </li>
                            <li className="flex items-center gap-4 text-white/40">
                                <Mail size={16} className="text-sky" />
                                <span className="text-xs font-bold">johnkihara305@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-4 text-white/40">
                                <MapPin size={16} className="text-sky" />
                                <a href="https://maps.app.goo.gl/hghocdA2n5AQceA19" target="_blank" rel="noopener noreferrer" className="text-xs font-bold hover:text-sky transition-colors">Find Us on Maps →</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
