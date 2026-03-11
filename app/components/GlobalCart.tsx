"use client";
import React from "react";
import CartPanel from "./CartPanel";
import { useCart } from "./CartContext";

export default function GlobalCart() {
    const { isCartOpen, setIsCartOpen } = useCart();

    return (
        <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    );
}
