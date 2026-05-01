import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ granted: false });
  }

  const admin = createAdminClient();

  // Check if this email has a pending purchase
  const { data: pending } = await admin
    .from("pending_lifetime_access")
    .select("email")
    .eq("email", user.email)
    .single();

  if (!pending) {
    return NextResponse.json({ granted: false });
  }

  // Grant access and clean up pending record
  await Promise.all([
    admin
      .from("users")
      .update({ lifetime_access: true })
      .eq("id", user.id),
    admin
      .from("pending_lifetime_access")
      .delete()
      .eq("email", user.email),
  ]);

  return NextResponse.json({ granted: true });
}
