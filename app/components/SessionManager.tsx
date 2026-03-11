"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SessionManager() {
    const router = useRouter();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const logout = async () => {
            const { data } = await supabase.auth.getSession();
            if (data?.session) {
                await supabase.auth.signOut();
                router.push("/staff/login");
            }
        };

        const resetTimer = () => {
            clearTimeout(timeoutId);
            // 10 minutes = 600,000 ms
            timeoutId = setTimeout(logout, 600000);
        };

        // Events that indicate user activity
        const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];

        events.forEach(event => window.addEventListener(event, resetTimer));

        // Initial timer start
        resetTimer();

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [router]);

    return null;
}
