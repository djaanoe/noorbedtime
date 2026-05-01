import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LIFETIME_PRODUCT } from "@/lib/credits";

export const metadata: Metadata = {
  title: "Unlock All Stories — $4.99 One-Time",
  description:
    "Get lifetime access to all 50+ Islamic bedtime stories for Muslim kids. One payment of $4.99, yours forever. 3 stories free, no account needed.",
  alternates: { canonical: "https://noorbedtime.com/credits" },
};

export default function CreditsPage() {
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

          {/* Single pricing card */}
          <div className="bg-gradient-to-br from-gold/10 to-navy-lighter rounded-2xl p-10 border border-gold/30 text-center relative mb-12 max-w-sm mx-auto">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-bold px-3 py-0.5 rounded-full">
              LIFETIME ACCESS
            </div>
            <div className="text-5xl font-extrabold text-cream mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              ${LIFETIME_PRODUCT.price.toFixed(2)}
            </div>
            <p className="text-gray-500 text-sm mb-6">one-time payment</p>
            <ul className="text-left space-y-2 text-sm text-gray-300 mb-8">
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> All 50+ Islamic stories</li>
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> All age tiers (3–5, 6–8, 9–12)</li>
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> New stories included as they launch</li>
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> Any device, anytime</li>
              <li className="flex items-center gap-2"><span className="text-teal">✓</span> No ads, ever</li>
            </ul>
            <a
              href={LIFETIME_PRODUCT.gumroadUrl}
              className="cta-glow block bg-gold text-navy font-bold py-4 rounded-xl hover:bg-gold-light transition-colors text-base"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Get Lifetime Access — $4.99
            </a>
            <p className="text-gray-600 text-xs mt-3">Secure checkout via Gumroad</p>
          </div>

          <p className="text-teal text-sm mb-16">3 stories are always free — no account needed to start.</p>

          {/* FAQ */}
          <div className="text-left space-y-4">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Outfit, sans-serif" }}>
              Frequently Asked Questions
            </h2>
            {[
              {
                q: "What do I get?",
                a: "You get lifetime access to all 50+ illustrated Islamic bedtime stories across three age tiers: Little Stars (3–5), Rising Moons (6–8), and Young Explorers (9–12). All future stories are also included.",
              },
              {
                q: "Is it really a one-time payment?",
                a: "Yes. Pay $4.99 once and your access never expires. There is no subscription, no renewal, and no hidden fees.",
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
