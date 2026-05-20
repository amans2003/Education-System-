import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Heart, ArrowRight, ShieldCheck, Globe
} from 'lucide-react';

const FacebookIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const InstagramIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

const LinkedinIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { Icon: FacebookIcon, color: 'hover:bg-[#1877F2]', label: 'Facebook' },
    { Icon: TwitterIcon, color: 'hover:bg-[#1DA1F2]', label: 'Twitter' },
    { Icon: InstagramIcon, color: 'hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]', label: 'Instagram' },
    { Icon: LinkedinIcon, color: 'hover:bg-[#0A66C2]', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-900 pt-20 pb-10 text-slate-300 relative overflow-hidden">
      {/* Decorative Gradient Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Identity */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <img 
                  src="/DP.png" 
                  alt="DP Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(255,255,255,0.9)]" 
                />
              </div>
              <div>
                <p className="text-primary-400 text-[10px] font-black uppercase tracking-widest mt-1">Trust. Quality. Life.</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              The premier ecosystem for discovering verified education and healthcare services. We bridge the gap between excellence and accessibility.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:text-white hover:-translate-y-1 transition-all duration-300 border border-slate-700 ${social.color}`}
                >
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Navigation</h3>
            <ul className="space-y-4">
              {[
                { label: 'Explore Elite', path: '/explore' },
                { label: 'Discover Services', path: '/listings' },
                { label: 'Partner Portal', path: '/dashboard' },
                { label: 'Saved Resources', path: '/wishlist' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm font-bold hover:text-primary-400 flex items-center gap-2 transition-colors group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Terminal */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contact Engine</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary-500" />
                </div>
                <p className="text-sm leading-tight text-slate-400">
                  123 Innovation Way, Tech District,<br />Maharashtra, India
                </p>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary-500" />
                </div>
                <p className="text-sm font-bold">+91 1800 555 0199</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary-500" />
                </div>
                <p className="text-sm font-bold">ops@platform.tech</p>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Insights Hub</h3>
            <p className="text-sm text-slate-400 mb-6">Join 15,000+ others receiving our curated weekly updates.</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter terminal email" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-500 font-bold"
                />
                <button className="absolute right-2 top-2 bottom-2 px-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 italic">No spam. Only high-value insights. Opt-out anytime.</p>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            © {currentYear} Platform. All Rights Reserved.
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Compliance</a>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for the community</span>
          </div>
        </div>
      </div>

      {/* Background Glows */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px]" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
    </footer>
  );
};

export default Footer;
