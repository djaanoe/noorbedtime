import { NextResponse } from "next/server";
import { getStoryBySlug } from "@/lib/stories";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (story.is_free) {
    return NextResponse.json(story);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("lifetime_access")
    .eq("id", user.id)
    .single();

  if (!profile?.lifetime_access) {
    return NextResponse.json({ error: "Lifetime access required" }, { status: 403 });
  }

  return NextResponse.json(story);
}
