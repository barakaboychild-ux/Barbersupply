const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://dhvkihmpebmaocjegmoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodmtpaG1wZWJtYW9jamVnbW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDU0OTQsImV4cCI6MjA4NzY4MTQ5NH0._B4ktUarAv5_xVMz0HrlPPNONLhtajLi_L3VxMv_lfI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProductsTable() {
    console.log("Checking products table...");
    const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Error accessing products table:", error.message);
        if (error.message.includes("does not exist")) {
            console.log("SUGGESTION: The 'products' table hasn't been created yet. Please run the SQL in database_setup.md");
        }
    } else {
        console.log(`Products table exists. Found ${count} items.`);
    }
}

checkProductsTable();
