import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — NoorBedtime",
  description: "Privacy Policy for NoorBedtime — Islamic bedtime stories for Muslim children.",
  alternates: { canonical: "https://noorbedtime.com/privacy" },
};

export default function PrivacyPage() {
  const updated = "May 2025";

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-400">Privacy Policy</span>
          </nav>

          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm mb-10">Last updated: {updated}</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-300 leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Who We Are</h2>
              <p>
                NoorBedtime (<strong className="text-white">noorbedtime.com</strong>) is a free Islamic bedtime story platform for Muslim children aged 3–12, created by Janu Prasetya. We provide scholar-validated stories inspired by the Quran and Prophet traditions, completely free with no account required.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
              <p>We do <strong className="text-white">not</strong> require you to create an account or submit any personal information to read our stories.</p>
              <p className="mt-3">We automatically collect limited, anonymous data through third-party services:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="text-white">Google Analytics</strong> — page views, session duration, general location (country/city), device type, and referral source. This data is aggregated and anonymous.</li>
                <li><strong className="text-white">Google AdSense</strong> — to show relevant ads, Google may use cookies to infer interests based on your browsing history across sites.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Cookies</h2>
              <p>
                We do not set our own cookies. Google Analytics and Google AdSense set their own cookies to measure traffic and serve relevant advertisements. You can opt out of Google Analytics via the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Analytics Opt-out Browser Add-on
                </a>
                , and manage ad personalization at{" "}
                <a href="https://adssettings.google.com" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Ad Settings
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. How We Use Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To understand which stories are most helpful to our community</li>
                <li>To improve site performance and content</li>
                <li>To display advertisements that help fund the free service</li>
              </ul>
              <p className="mt-3">We never sell data to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Children's Privacy</h2>
              <p>
                NoorBedtime is designed for children but operated by parents and guardians. We do not knowingly collect personal information from children under 13. Because no account or form submission is required to use the site, no personal data from children is stored on our servers.
              </p>
              <p className="mt-3">
                Google AdSense is configured to comply with child-directed content policies under COPPA and GDPR-K. If you believe your child's data has been inadvertently collected, contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Third-Party Services</h2>
              <p>We use the following third-party services. Their own privacy policies apply:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <a href="https://policies.google.com/privacy" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
                  {" "}(Analytics + AdSense)
                </li>
                <li>
                  <a href="https://vercel.com/legal/privacy-policy" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a>
                  {" "}(hosting)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Your Rights</h2>
              <p>
                Depending on your location, you may have rights under GDPR (EU) or CCPA (California) to access, correct, or delete data held about you. Since NoorBedtime itself holds no personal data, these rights primarily apply to data held by Google. You can manage Google's data about you at{" "}
                <a href="https://myaccount.google.com" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">myaccount.google.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
              <p>
                Questions about this policy? Reach out via Threads{" "}
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
