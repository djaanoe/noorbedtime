import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-xl font-bold text-gold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>NoorBedtime</div>
            <p className="text-gray-500 text-xs">Stories of Light, Before Goodnight</p>
          </div>
          <nav className="flex flex-wrap gap-5 text-xs text-gray-400">
            <Link href="/library" className="hover:text-gold transition-colors">Library</Link>
            <Link href="/donate" className="hover:text-gold transition-colors">Donate</Link>
            <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
            <Link href="/account" className="hover:text-gold transition-colors">Account</Link>
          </nav>
          <div className="flex gap-4 text-gray-500 text-sm">
            <a href="https://instagram.com/noorbedtime" className="hover:text-gold transition-colors">IG</a>
            <a href="https://twitter.com/noorbedtime" className="hover:text-gold transition-colors">X</a>
            <a href="https://facebook.com/noorbedtime" className="hover:text-gold transition-colors">FB</a>
          </div>
        </div>
        <div className="text-center mt-6 text-gray-600 text-xs">
          <p>&copy; {new Date().getFullYear()} NoorBedtime. Made with love for the Muslim Ummah.</p>
        </div>
      </div>
    </footer>
  );
}
