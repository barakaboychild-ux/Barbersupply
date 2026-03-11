const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://dhvkihmpebmaocjegmoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodmtpaG1wZWJtYW9jamVnbW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDU0OTQsImV4cCI6MjA4NzY4MTQ5NH0._B4ktUarAv5_xVMz0HrlPPNONLhtajLi_L3VxMv_lfI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function approveStaff() {
    const email = "barakaboychild@gmail.com";
    console.log(`Setting up staff record for: ${email}`);

    const { data, error } = await supabase
        .from('staff_requests')
        .insert({
            email: email,
            status: 'approved',
            full_name: 'Barak',
            phone: 'N/A'
        })
        .select();

    if (error) {
        console.error("Error updating staff table:", error.message);
    } else {
        console.log("Success! Staff member approved.");
        console.log(data);
    }
}

approveStaff();
