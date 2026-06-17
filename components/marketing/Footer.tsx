import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <span className="text-xl font-bold">Apply<span className="text-[#3B82F6]">AI</span></span>
            <p className="text-white/50 text-sm mt-2 max-w-xs">
              AI-powered cover letters that land interviews. Built for job seekers who mean business.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/#features" className="text-sm text-white/50 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/guide" className="text-sm text-white/50 hover:text-white transition-colors">Guide</Link></li>
                <li><Link href="/blog" className="text-sm text-white/50 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Contact</h4>
              <a href="mailto:hello@applyai.ink" className="text-sm text-white/50 hover:text-white transition-colors">hello@applyai.ink</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} ApplyAI. All rights reserved.</p>
          <p className="text-white/30 text-xs">Made with ❤️ for job seekers everywhere</p>
        </div>
      </div>
    </footer>
  )
}
