const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://dhvkihmpebmaocjegmoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodmtpaG1wZWJtYW9jamVnbW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDU0OTQsImV4cCI6MjA4NzY4MTQ5NH0._B4ktUarAv5_xVMz0HrlPPNONLhtajLi_L3VxMv_lfI";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkOrders() {
    const { data: orders, error } = await supabase.from('orders').select('*').limit(1);
    if (error) {
        console.error("Error fetching orders:", error.message);
    } else {
        console.log("Orders schema / first row:", JSON.stringify(orders[0] || {}, null, 2));
    }
}

checkOrders();
