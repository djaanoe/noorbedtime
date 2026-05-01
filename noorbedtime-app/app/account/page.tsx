import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your NoorBedtime account and access.",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("users")
    .select("lifetime_access, name")
    .eq("id", user.id)
    .single();

  const { data: recentStories } = await supabase
    .from("user_library")
    .select("story_id, unlocked_at")
    .eq("user_id", user.id)
    .order("unlocked_at", { ascending: false })
    .limit(10);

  const hasAccess = profile?.lifetime_access ?? false;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "Outfit, sans-serif" }}>
            My Account
          </h1>

          {/* Access status */}
          <div className="bg-navy-lighter rounded-2xl p-6 border border-gray-700/30 mb-4">
            <p className="text-xs text-gray-500 mb-1">Access Status</p>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-sm font-bold ${hasAccess ? "text-teal" : "text-gray-400"}`}
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {hasAccess ? "Full Access ✓" : "Free Plan"}
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-4">
              {hasAccess
                ? "You have lifetime access to all 50+ stories."
                : "You have access to 3 free stories."}
            </p>
            {!hasAccess && (
              <Link
                href="/credits"
                className="inline-block bg-gold text-navy text-xs font-bold px-4 py-2 rounded-xl hover:bg-gold-light transition-colors"
              >
                Unlock All Stories — $4.99
              </Link>
            )}
          </div>

          {/* Profile */}
          <div className="bg-navy-lighter rounded-2xl p-6 border border-gray-700/30 mb-6">
            <h2 className="font-bold mb-4 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
              Profile
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Name</p>
                <p className="text-sm text-gray-200">{profile?.name ?? user.user_metadata?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                <p className="text-sm text-gray-200">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Reading history */}
          <div className="bg-navy-lighter rounded-2xl p-6 border border-gray-700/30 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
                Reading History
              </h2>
              <Link href="/library" className="text-xs text-gold hover:underline">
                Browse Library
              </Link>
            </div>
            {recentStories && recentStories.length > 0 ? (
              <div className="space-y-2">
                {recentStories.map((item) => (
                  <div key={item.story_id} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                    <span className="text-sm text-gray-300">{item.story_id}</span>
                    <Link href={`/read/${item.story_id}`} className="text-xs text-gold hover:underline">
                      Read →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No stories read yet.</p>
            )}
          </div>

          {/* Sign out */}
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-rose transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
