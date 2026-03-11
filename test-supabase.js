
const { createClient } = require('@supabase/supabase-js');

// Hardcoding for immediate diagnosis since .env.local exists but node doesn't see it correctly without dotenv
const supabaseUrl = "https://dhvkihmpebmaocjegmoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodmtpaG1wZWJtYW9jamVnbW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDU0OTQsImV4cCI6MjA4NzY4MTQ5NH0._B4ktUarAv5_xVMz0HrlPPNONLhtajLi_L3VxMv_lfI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log("Testing connection to:", supabaseUrl);

    // Test 1: Fetch products
    console.log("\n--- Test 1: Products ---");
    const { data: products, error: pError } = await supabase.from('products').select('*').limit(1);
    if (pError) console.error("Error fetching products:", pError.message);
    else console.log("Success! Found", products.length, "products.");

    // Test 2: Fetch staff_requests
    console.log("\n--- Test 2: Staff Requests ---");
    const { data: staff, error: sError } = await supabase.from('staff_requests').select('*').limit(5);
    if (sError) console.error("Error fetching staff_requests:", sError.message);
    else {
        console.log("Success! Found", staff.length, "entries.");
        staff.forEach(s => console.log(`- ${s.email} (${s.status})`));
    }

    // Test 3: Attempt Sign Up
    console.log("\n--- Test 3: Auth Sign Up ---");
    const testEmail = `test_${Date.now()}@example.com`;
    console.log("Attempting signup for:", testEmail);
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'Password123!',
    });

    // Test 4: Fetch store settings
    console.log("\n--- Test 4: Store Settings ---");
    const { data: settings, error: settingsError } = await supabase.from('store_settings').select('*');
    if (settingsError) console.error("Error fetching settings:", settingsError.message);
    else {
        console.log("Success! Found", settings.length, "settings entries.");
        settings.forEach(s => console.log(`- ${s.key}: "${s.value}"`));
    }
}

testConnection();
