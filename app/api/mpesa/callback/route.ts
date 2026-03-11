import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));

        const stkCallback = body.Body.stkCallback;
        const resultCode = stkCallback.ResultCode;
        const checkoutRequestID = stkCallback.CheckoutRequestID;

        // 1. Log payment result
        console.log(`Payment Result for ${checkoutRequestID}: ${resultCode === 0 ? 'Success' : 'Failed'} (${stkCallback.ResultDesc})`);

        // 2. Map M-Pesa status to order status
        // ResultCode === 0 means success, everything else is a failure/cancellation
        const orderStatus = resultCode === 0 ? 'processing' : 'cancelled';

        // 3. Update the order in Supabase
        // Note: This requires the 'orders' table to have a 'checkout_request_id' column
        // If RLS is enabled, this route needs to use a Service Role Key or have specific policies.
        const { error: updateError } = await supabase
            .from('orders')
            .update({ 
                status: orderStatus,
                mpesa_result_code: resultCode,
                mpesa_result_desc: stkCallback.ResultDesc
            })
            .eq('checkout_request_id', checkoutRequestID);

        if (updateError) {
            console.error("Failed to update order status in Supabase:", updateError);
            // We still return 0 to Safaricom to acknowledge receipt of callback, 
            // but we might want to log this for manual intervention.
        }

        return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    } catch (error: any) {
        console.error("Callback processing error:", error);
        return NextResponse.json({ ResultCode: 1, ResultDesc: "Error processing" }, { status: 500 });
    }
}
