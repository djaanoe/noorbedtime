import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

          {/* Brand */}
          <div>
            <div className="text-xl font-bold text-gold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>NoorBedtime</div>
            <p className="text-gray-500 text-xs">Stories of Light, Before Goodnight</p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-5 text-xs text-gray-400">
            <Link href="/library" className="hover:text-gold transition-colors">Library</Link>
            <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
            <Link href="/donate" className="hover:text-gold transition-colors">Donate</Link>
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
          </nav>

          {/* Made by */}
          <div className="text-xs text-gray-500">
            <p className="mb-1">Made by <span className="text-gray-300">Janu Prasetya</span></p>
            <div className="flex gap-3">
              <a
                href="https://www.threads.net/@djaanoe"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                Threads @djaanoe
              </a>
              <span>·</span>
              <a
                href="https://www.linkedin.com/in/januprasetya/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

        </div>

        <div className="text-center mt-8 text-gray-600 text-xs">
          <p>&copy; {new Date().getFullYear()} NoorBedtime. Made with love for the Muslim Ummah.</p>
        </div>
      </div>
    </footer>
  );
}
