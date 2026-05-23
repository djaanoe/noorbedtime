import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DONATE_CONFIG } from "@/lib/donate";

export const metadata: Metadata = {
  title: "Support NoorBedtime — Keep Islamic Stories Free Forever",
  description:
    "NoorBedtime is free for every Muslim family. Support us with a small donation to help create more illustrated Islamic bedtime stories for children.",
  alternates: { canonical: "https://noorbedtime.com/donate" },
};

export default function DonatePage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-navy">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">💛</div>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Support NoorBedtime
          </h1>
          <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
            NoorBedtime is completely free for every Muslim family. We believe every child deserves access to beautiful Islamic stories — regardless of their family&apos;s circumstances.
          </p>

          {DONATE_CONFIG.isReady ? (
            <div className="bg-gradient-to-br from-gold/10 to-navy-lighter rounded-2xl p-10 border border-gold/30 max-w-sm mx-auto mb-8">
              <p className="text-gray-300 text-sm mb-6">
                Your support helps us create more illustrated stories for Muslim children around the world.
              </p>
              <a
                href={DONATE_CONFIG.kofiPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gold text-navy font-bold py-4 rounded-xl hover:bg-gold-light transition-colors text-base"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                ❤️ Donate via Ko-fi
              </a>
              <p className="text-gray-600 text-xs mt-3">Powered by Ko-fi · Any amount helps</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gold/10 to-navy-lighter rounded-2xl p-10 border border-gold/30 max-w-sm mx-auto mb-8">
              <div className="bg-gold/10 border border-gold/20 rounded-xl px-4 py-3 mb-6">
                <p className="text-gold text-sm font-semibold">🌙 Coming Soon</p>
                <p className="text-gray-400 text-xs mt-1">
                  We&apos;re setting up our donation system. Check back soon!
                </p>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                In the meantime, you can support us by sharing NoorBedtime with other Muslim parents.
              </p>
              <a
                href="https://twitter.com/intent/tweet?text=NoorBedtime+has+50%2B+free+Islamic+bedtime+stories+for+Muslim+children%21+noorbedtime.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-navy border border-gold/30 text-gold font-bold py-3 rounded-xl hover:bg-gold/10 transition-colors text-sm"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Share on X (Twitter) →
              </a>
            </div>
          )}

          <div className="space-y-4 text-left max-w-sm mx-auto mb-12">
            <h2
              className="text-lg font-bold text-white text-center mb-5"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              What Your Support Enables
            </h2>
            {[
              { icon: "📖", text: "Creating more illustrated Islamic stories for all age groups" },
              { icon: "🌍", text: "Keeping the library free for Muslim families everywhere" },
              { icon: "✨", text: "Adding new prophets, themes, and Quran story collections" },
              { icon: "🎨", text: "Improving illustrations and storytelling quality" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3 text-gray-300 text-sm">
                <span className="text-lg shrink-0">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="bg-navy-lighter rounded-2xl border border-gray-700/30 p-6 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Not ready to donate? You can still support us by exploring our free library.
            </p>
            <Link
              href="/library"
              className="inline-block border border-gold/40 text-gold text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-gold/10 transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Browse All Stories →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
