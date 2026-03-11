const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://dhvkihmpebmaocjegmoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodmtpaG1wZWJtYW9jamVnbW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDU0OTQsImV4cCI6MjA4NzY4MTQ5NH0._B4ktUarAv5_xVMz0HrlPPNONLhtajLi_L3VxMv_lfI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const products = [
    { name: "Gold Series Clipper", price: 199.00, offer_price: 159.00, category: "Clippers", image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80", description: "Precision-engineered professional clipper with surgical-grade blades." },
    { name: "Matte Finish Pomade", price: 24.00, offer_price: null, category: "Hair products", image_url: "https://images.unsplash.com/photo-1599351431247-f577f9747c9c?w=800&q=80", description: "High-hold, matte finish pomade for all hair types." },
    { name: "Titanium Detailer", price: 135.00, offer_price: 110.00, category: "Trimmers", image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80", description: "T-blade detailer for crisp lines and intricate design work." },
    { name: "Beard Wash", price: 22.00, offer_price: null, category: "Hair products", image_url: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=800&q=80", description: "Gentle yet effective beard wash infused with natural oils." },
    { name: "Industrial Barber Cape", price: 45.00, offer_price: 35.00, category: "Accessories", image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80", description: "Lightweight, water-repellent cape for maximum comfort." },
    { name: "Carbon Fiber Comb", price: 18.00, offer_price: 12.00, category: "Accessories", image_url: "https://images.unsplash.com/photo-1590540179852-211d6b45e390?w=800&q=80", description: "Heat-resistant, anti-static carbon fiber comb for precision styling." },
    { name: "Professional Scissors", price: 85.00, offer_price: 70.00, category: "Accessories", image_url: "https://images.unsplash.com/photo-1593702295094-172f14293581?w=800&q=80", description: "Hand-crafted surgical steel scissors for precision cutting." },
    { name: "Texturizing Spray", price: 28.00, offer_price: null, category: "Cosmetics", image_url: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=800&q=80", description: "Sea salt texturizing spray for effortless volume and texture." }
];

async function seedProducts() {
    console.log("Seeding products...");
    const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();

    if (error) {
        console.error("Error seeding products:", error.message);
    } else {
        console.log(`Success! Seeded ${data.length} products.`);
    }
}

seedProducts();
