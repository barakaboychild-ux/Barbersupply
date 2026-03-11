const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://dhvkihmpebmaocjegmoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodmtpaG1wZWJtYW9jamVnbW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDU0OTQsImV4cCI6MjA4NzY4MTQ5NH0._B4ktUarAv5_xVMz0HrlPPNONLhtajLi_L3VxMv_lfI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStorage() {
    console.log("Checking storage buckets...");

    // 1. List buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
        console.error("Error listing buckets:", bucketError.message);
    } else {
        console.log("Buckets found:", buckets.map(b => `${b.name} (Public: ${b.public})`).join(", "));

        const productsBucket = buckets.find(b => b.name === 'products');
        if (!productsBucket) {
            console.log("WARNING: 'products' bucket NOT found.");
        } else if (!productsBucket.public) {
            console.log("WARNING: 'products' bucket is PRIVATE. Images will not be visible to users.");
        }
    }

    // 2. Try to list files in 'products'
    console.log("\nAttempting to list files in 'products' bucket...");
    const { data: files, error: fileError } = await supabase.storage.from('products').list('product-images');

    if (fileError) {
        console.error("Error listing files:", fileError.message);
    } else {
        console.log(`Found ${files.length} files in 'product-images/'.`);
        files.forEach(f => console.log(` - ${f.name}`));
    }
}

checkStorage();
