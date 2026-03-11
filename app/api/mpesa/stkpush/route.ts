import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { phone, amount, orderId } = await req.json();

        const consumerKey = process.env.DARAJA_CONSUMER_KEY;
        const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
        const passkey = process.env.DARAJA_PASSKEY;
        const shortcode = process.env.DARAJA_SHORTCODE;
        const callbackUrl = process.env.DARAJA_CALLBACK_URL || 'https://your-domain.ngrok-free.app/api/mpesa/callback';

        // 1. If credentials are not set, return a mock success for development purposes
        // This ensures the frontend doesn't break while you're setting up the credentials.
        if (!consumerKey || !consumerSecret || !passkey || !shortcode) {
            console.log("Daraja credentials missing. Proceeding with Mock STK Push for development.");
            return NextResponse.json({
                ResponseCode: "0",
                ResponseDescription: "[MOCK] Success. Request accepted for processing",
                CheckoutRequestID: `ws_CO_${Date.now()}`,
                CustomerMessage: "Success. Request accepted for processing"
            });
        }

        const isProduction = process.env.DARAJA_ENVIRONMENT === 'production';
        const baseUrl = isProduction 
            ? 'https://api.safaricom.co.ke' 
            : 'https://sandbox.safaricom.co.ke';

        // 2. Get Access Token
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const tokenResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: { Authorization: `Basic ${auth}` },
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) throw new Error("Failed to get Daraja access token");

        // 3. Generate Password
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHmmss
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        // 4. Format Phone Number (Safaricom requires 2547XXXXXXXX)
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.slice(1);
        } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
            formattedPhone = '254' + formattedPhone;
        }

        // 5. Initiate STK Push
        const stkPayload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline", // Or CustomerBuyGoodsOnline
            Amount: Math.ceil(Number(amount)),
            PartyA: formattedPhone,
            PartyB: shortcode,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: orderId || "BarberSupply",
            TransactionDesc: "Payment for Order " + orderId
        };

        const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stkPayload)
        });

        const stkData = await stkResponse.json();

        // 6. Update order with CheckoutRequestID for callback tracking
        if (stkData.ResponseCode === "0") {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ checkout_request_id: stkData.CheckoutRequestID })
                .eq('id', orderId);
            
            if (updateError) {
                console.error("Failed to update order with CheckoutRequestID:", updateError);
            }
        }

        return NextResponse.json(stkData);

    } catch (error: any) {
        console.error("M-Pesa STK Push error:", error);
        return NextResponse.json({ error: error.message || "Failed to initiate M-Pesa payment" }, { status: 500 });
    }
}
