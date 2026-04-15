import { useState } from 'react';
import { FiFacebook, FiYoutube, FiInstagram, FiTwitter, FiChevronDown } from 'react-icons/fi';

const FOOTER_SECTIONS = [
  {
    title: 'ABOUT',
    links: ['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information'],
  },
  {
    title: 'GROUP COMPANIES',
    links: ['Myntra', 'Cleartrip', 'Shopsy'],
  },
  {
    title: 'HELP',
    links: ['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ'],
  },
  {
    title: 'CONSUMER POLICY',
    links: ['Cancellation & Returns', 'Terms Of Use', 'Security', 'Privacy', 'Sitemap', 'Grievance Redressal', 'EPR Compliance'],
  },
];

const PAYMENT_ICONS = [
  { label: 'VISA', bg: '#1a1f71', color: '#fff', text: 'VISA' },
  { label: 'Mastercard', bg: '#eb001b', color: '#fff', text: 'MC' },
  { label: 'Maestro', bg: '#0099df', color: '#fff', text: 'MA' },
  { label: 'Amex', bg: '#007bc1', color: '#fff', text: 'AMEX' },
  { label: 'Diners', bg: '#004b87', color: '#fff', text: 'DC' },
  { label: 'Discover', bg: '#ff6600', color: '#fff', text: 'DISC' },
  { label: 'RuPay', bg: '#138808', color: '#fff', text: 'RuPay' },
  { label: 'Net Banking', bg: '#444', color: '#fff', text: 'NB' },
  { label: 'Cash On Delivery', bg: '#555', color: '#fff', text: 'COD' },
  { label: 'EMI', bg: '#666', color: '#fff', text: 'EMI' },
];

// Collapsible section for mobile
function FooterSection({ title, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#ffffff10] md:border-0">
      <button
        className="w-full flex items-center justify-between py-3 md:py-0 md:cursor-default"
        onClick={() => setOpen(o => !o)}
      >
        <h3 className="text-white text-xs font-bold tracking-widest uppercase">{title}</h3>
        <FiChevronDown
          className={`text-gray-400 md:hidden transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <ul className={`space-y-2 overflow-hidden transition-all md:block md:mt-4 ${open ? 'mt-2 mb-3' : 'hidden'}`}>
        {links.map(link => (
          <li key={link}>
            <a href="#" className="text-[13px] text-gray-400 hover:text-white transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-gray-400 mt-auto">

      {/* ── Main footer links ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-0 md:gap-8">

          {/* Collapsible link columns (mobile) / normal (desktop) */}
          <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-6">
            {FOOTER_SECTIONS.map(section => (
              <FooterSection key={section.title} title={section.title} links={section.links} />
            ))}
          </div>

          {/* Mail Us */}
          <div className="border-b border-[#ffffff10] md:border-0 py-3 md:py-0">
            <h3 className="text-white text-xs font-bold tracking-widest mb-2 md:mb-4 uppercase">Mail Us</h3>
            <address className="not-italic text-[13px] leading-relaxed text-gray-400">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India
            </address>
          </div>

          {/* Registered Office + Social */}
          <div className="py-3 md:py-0">
            <h3 className="text-white text-xs font-bold tracking-widest mb-2 md:mb-4 uppercase">Registered Office</h3>
            <address className="not-italic text-[13px] leading-relaxed text-gray-400 mb-4">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India<br />
              CIN : U51109KA2012PTC066107<br />
              Telephone:{' '}
              <a href="tel:044-45614700" className="text-[#2874f0] hover:underline">044-45614700</a>
              {' / '}
              <a href="tel:044-67415800" className="text-[#2874f0] hover:underline">044-67415800</a>
            </address>

            <h3 className="text-white text-xs font-bold tracking-widest mb-3 uppercase">Social</h3>
            <div className="flex items-center gap-3 sm:gap-4">
              {[
                { icon: <FiFacebook />, label: 'Facebook' },
                { icon: <FiTwitter />, label: 'Twitter / X' },
                { icon: <FiYoutube />, label: 'YouTube' },
                { icon: <FiInstagram />, label: 'Instagram' },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="text-gray-400 hover:text-white transition-colors text-lg">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#ffffff15]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">

          {/* Left: quick links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5">
            {[
              { emoji: '🏬', label: 'Become a Seller' },
              { emoji: '📣', label: 'Advertise' },
              { emoji: '🎁', label: 'Gift Cards' },
              { emoji: '❓', label: 'Help Center' },
            ].map(item => (
              <a key={item.label} href="#"
                className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-[13px] text-gray-400 hover:text-white transition-colors">
                <span className="text-sm sm:text-base">{item.emoji}</span>
                {item.label}
              </a>
            ))}
          </div>

          {/* Center: copyright */}
          <p className="text-[11px] sm:text-[12px] text-gray-500 text-center order-last sm:order-none">
            © 2007–2026 Flipkart.com
          </p>

          {/* Right: payment icons */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            {PAYMENT_ICONS.map(p => (
              <div
                key={p.label}
                title={p.label}
                className="flex items-center justify-center h-4 sm:h-5 px-1 sm:px-1.5 rounded text-[8px] sm:text-[9px] font-bold"
                style={{ backgroundColor: p.bg, color: p.color, minWidth: '24px' }}
              >
                {p.text}
              </div>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}