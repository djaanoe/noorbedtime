import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FOUNDER_PRODUCT } from "@/lib/credits";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unlock All Stories — Founder's Offer",
  description:
    "Get lifetime access to all 50+ Islamic bedtime stories for Muslim kids. Founder's offer: $4.99 one-time for the first 100 members. Regular price $14.99.",
  alternates: { canonical: "https://noorbedtime.com/credits" },
};

async function getFounderSpotsLeft(): Promise<number> {
  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("lifetime_access", true);
    return Math.max(0, FOUNDER_PRODUCT.founderLimit - (count ?? 0));
  } catch {
    return FOUNDER_PRODUCT.founderLimit;
  }
}

export default async function CreditsPage() {
  const spotsLeft = await getFounderSpotsLeft();
  const founderActive = spotsLeft > 0;

  const activePrice = founderActive ? FOUNDER_PRODUCT.founderPrice : FOUNDER_PRODUCT.regularPrice;
  const activeUrl = founderActive ? FOUNDER_PRODUCT.founderGumroadUrl : FOUNDER_PRODUCT.regularGumroadUrl;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
            Unlock All 50+ Stories
          </h1>
          <p className="text-gray-400 max-w-md mx-auto mb-10">
            One payment. Every story. Forever. No subscription, no renewal, no surprises.
          </p>

          {/* Pricing card */}
          <div className="bg-gradient-to-br from-gold/10 to-navy-lighter rounded-2xl p-10 border border-gold/30 text-center relative mb-6 max-w-sm mx-auto">
            {founderActive ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                🔥 FOUNDER&apos;S OFFER — {spotsLeft} SPOTS LEFT
              </div>
            ) : (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-bold px-3 py-0.5 rounded-full">
                LIFETIME ACCESS
              </div>
            )}

            <div className="mb-1">
              {founderActive && (
                <span className="text-gray-500 line-through text-lg mr-2">
                  ${FOUNDER_PRODUCT.regularPrice.toFixed(2)}
                </span>
              )}
              <span className="text-5xl font-extrabold text-cream" style={{ fontFamily: "Outfit, sans-serif" }}>
                ${activePrice.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              {founderActive ? "one-time · founder's price" : "one-time payment"}
            </p>

            <ul className="text-left space-y-2 text-sm text-gray-300 mb-8">
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> All 50+ Islamic stories</li>
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> All age tiers (3–5, 6–8, 9–12)</li>
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> New stories included as they launch</li>
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> Any device, anytime</li>
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> No ads, ever</li>
            </ul>

            <a
              href={activeUrl}
              className="cta-glow block bg-gold text-navy font-bold py-4 rounded-xl hover:bg-gold-light transition-colors text-base"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Get Lifetime Access — ${activePrice.toFixed(2)}
            </a>
            <p className="text-gray-600 text-xs mt-3">Secure checkout via Gumroad</p>
          </div>

          {founderActive && (
            <p className="text-gray-500 text-xs mb-10">
              After {FOUNDER_PRODUCT.founderLimit} founders, price returns to ${FOUNDER_PRODUCT.regularPrice.toFixed(2)}.{" "}
              <span className="text-gold">{spotsLeft} spots remaining.</span>
            </p>
          )}

          <p className="text-teal text-sm mb-16">3 stories are always free — no account needed to start.</p>

          {/* FAQ */}
          <div className="text-left space-y-4">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Outfit, sans-serif" }}>
              Frequently Asked Questions
            </h2>
            {[
              {
                q: "What do I get?",
                a: "Lifetime access to all 50+ illustrated Islamic bedtime stories across three age tiers: Little Stars (3–5), Rising Moons (6–8), and Young Explorers (9–12). All future stories are also included.",
              },
              {
                q: "Is it really a one-time payment?",
                a: `Yes. Pay once and your access never expires. No subscription, no renewal, no hidden fees. Founder members lock in $${FOUNDER_PRODUCT.founderPrice.toFixed(2)} — the price will go up to $${FOUNDER_PRODUCT.regularPrice.toFixed(2)} after the first ${FOUNDER_PRODUCT.founderLimit} members.`,
              },
              {
                q: "What payment methods are accepted?",
                a: "Checkout is handled securely by Gumroad. All major credit cards and PayPal are accepted.",
              },
              {
                q: "Can I get a refund?",
                a: "Yes. If you are not satisfied, contact us within 7 days of purchase and we will issue a full refund, no questions asked.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-navy-lighter rounded-xl p-5 border border-gray-700/30">
                <h3 className="font-semibold mb-2 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {q}
                </h3>
                <p className="text-gray-400 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
