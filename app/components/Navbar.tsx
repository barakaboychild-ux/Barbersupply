"use client";
import React from 'react';
import { ShoppingCart, User, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-[#06162C] text-white py-4 px-6 flex justify-between items-center shadow-lg relative z-50">
      <div className="flex items-center gap-4">
        <Menu className="md:hidden cursor-pointer" />
        <h1 className="text-xl font-black tracking-tighter uppercase">
          Barber<span className="text-[#0EA5E9]">Supply</span>
        </h1>
      </div>

      <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest">
        <a href="/" className="hover:text-[#0EA5E9] transition-colors">Home</a>
        <a href="#" className="hover:text-[#0EA5E9] transition-colors">Clippers</a>
        <a href="#" className="hover:text-[#0EA5E9] transition-colors">Cosmetics</a>
      </div>

      <div className="flex gap-5 items-center">
        <User className="cursor-pointer hover:text-[#0EA5E9]" />
        <div className="relative">
          <ShoppingCart className="cursor-pointer hover:text-[#0EA5E9]" />
          <span className="absolute -top-2 -right-2 bg-[#0EA5E9] text-white text-[10px] font-bold px-1.5 rounded-full">0</span>
        </div>
      </div>
    </nav>
  );
}