export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Portfolio</h3>
            <p className="text-muted-foreground">
              Seorang developer yang passionate tentang menciptakan pengalaman digital yang luar biasa.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Navigasi</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-accent transition-colors">
                  Tentang
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-accent transition-colors">
                  Proyek
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-accent transition-colors">
                  Keahlian
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent transition-colors">
                  Kontak
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Informasi</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Portfolio. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
