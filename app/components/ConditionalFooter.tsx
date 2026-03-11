"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
    const pathname = usePathname();

    // Hide footer on staff authentication pages
    if (pathname.startsWith('/staff/login') || pathname.startsWith('/staff/signup')) {
        return null;
    }

    return <Footer />;
}
