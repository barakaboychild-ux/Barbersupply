const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://dhvkihmpebmaocjegmoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodmtpaG1wZWJtYW9jamVnbW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDU0OTQsImV4cCI6MjA4NzY4MTQ5NH0._B4ktUarAv5_xVMz0HrlPPNONLhtajLi_L3VxMv_lfI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStaff() {
    console.log("Checking staff_requests table...");
    const { data: staff, error } = await supabase
        .from('staff_requests')
        .select('*');

    if (error) {
        console.error("Error fetching staff:", error.message);
    } else {
        console.log(`Found ${staff.length} staff records:`);
        staff.forEach(s => {
            console.log(`- Email: ${s.email}, Status: ${s.status}, Name: ${s.full_name}`);
        });

        if (staff.length === 0) {
            console.log("WARNING: No staff records found. Login will fail for ANY Auth user because the code requires a match in this table.");
        }
    }
}

checkStaff();
