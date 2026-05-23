import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — NoorBedtime",
  description: "Terms of Service for NoorBedtime — Islamic bedtime stories for Muslim children.",
  alternates: { canonical: "https://noorbedtime.com/terms" },
};

export default function TermsPage() {
  const updated = "May 2025";

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-400">Terms of Service</span>
          </nav>

          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            Terms of Service
          </h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: {updated}</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-300 leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using NoorBedtime (<strong className="text-white">noorbedtime.com</strong>), you agree to be bound by these Terms of Service. If you do not agree, please do not use the site. These terms apply to all visitors, including parents and guardians who use the site on behalf of their children.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. The Service</h2>
              <p>
                NoorBedtime provides free Islamic bedtime stories for Muslim children aged 3–12. All stories are inspired by the Quran, Hadith, and Islamic tradition. The service is provided as-is, without any warranty of uninterrupted access or specific results.
              </p>
              <p className="mt-3">
                We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Acceptable Use</h2>
              <p>You agree to use NoorBedtime only for lawful, personal, non-commercial purposes. You may not:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Scrape, reproduce, or redistribute our story content in bulk without permission</li>
                <li>Use the site in a way that damages, disables, or impairs the service</li>
                <li>Attempt to gain unauthorized access to any part of the site</li>
                <li>Use automated tools to access content at a rate that burdens our servers</li>
              </ul>
              <p className="mt-3">
                Sharing individual stories with family and friends is warmly encouraged.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Intellectual Property</h2>
              <p>
                All story text, illustrations, and site content are the property of NoorBedtime and its creator, Janu Prasetya, unless otherwise noted. Stories are inspired by public-domain Islamic source texts (Quran, Hadith), but the specific creative expression in each story is original work.
              </p>
              <p className="mt-3">
                You may share, quote briefly, or link to stories for personal, educational, or dawah purposes, provided you credit NoorBedtime and link back to the original page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Islamic Content Disclaimer</h2>
              <p>
                Our stories are designed to be authentic to Islamic teachings and are reviewed for accuracy. However, NoorBedtime is not a fatwa-issuing authority. For matters of religious rulings or theological questions, please consult a qualified Islamic scholar.
              </p>
              <p className="mt-3">
                We strive to represent the beauty of Islam accurately, but we acknowledge that interpretations may vary across madhabs and scholarly traditions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Advertisements</h2>
              <p>
                NoorBedtime displays advertisements served by Google AdSense to help fund the free service. We do not endorse the products or services advertised. If you encounter an ad that is inappropriate for a Muslim family audience, please contact us so we can review our ad settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Limitation of Liability</h2>
              <p>
                NoorBedtime and its creator shall not be liable for any indirect, incidental, or consequential damages arising from your use of or inability to use the service. The site is provided "as is" without warranties of any kind, either express or implied.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Third-Party Links</h2>
              <p>
                The site may contain links to external websites (e.g., donation platforms, references). NoorBedtime has no control over and assumes no responsibility for the content or practices of any third-party sites.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Governing Law</h2>
              <p>
                These terms are governed by the laws of Indonesia. Any disputes shall be resolved in the courts of Indonesia.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">10. Changes to Terms</h2>
              <p>
                We may update these terms at any time. The "Last updated" date reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">11. Contact</h2>
              <p>
                Questions about these terms? Reach out via Threads{" "}
                <a href="https://www.threads.net/@djaanoe" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">@djaanoe</a>
                {" "}or LinkedIn{" "}
                <a href="https://www.linkedin.com/in/januprasetya/" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">Janu Prasetya</a>.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
