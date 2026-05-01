import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.formData();

  const email = body.get("email") as string | null;
  const sellerId = body.get("seller_id") as string | null;
  const refunded = body.get("refunded") as string | null;

  // Verify request is from our Gumroad account
  const expectedSellerId = process.env.GUMROAD_SELLER_ID;
  if (expectedSellerId && sellerId !== expectedSellerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Skip refunds
  if (refunded === "true") {
    return NextResponse.json({ ok: true, skipped: "refund" });
  }

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Check if user already has an account
  const { data: user } = await supabase
    .from("users")
    .select("id, lifetime_access")
    .eq("email", email)
    .single();

  if (user) {
    // User exists — grant access immediately
    await supabase
      .from("users")
      .update({ lifetime_access: true })
      .eq("id", user.id);

    return NextResponse.json({ ok: true, granted: true });
  }

  // User hasn't registered yet — store as pending
  await supabase
    .from("pending_lifetime_access")
    .upsert({ email, purchased_at: new Date().toISOString() });

  return NextResponse.json({ ok: true, pending: true });
}
