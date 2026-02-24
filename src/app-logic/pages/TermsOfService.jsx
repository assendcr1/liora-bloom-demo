import React from 'react';
import { ScrollText, Truck, RefreshCw, AlertCircle, Flower2, CreditCard } from 'lucide-react';

export default function TermsOfService() {
  const terms = [
    {
      title: "Nature's Substitution Policy",
      icon: <Flower2 size={20} />,
      content: "Flowers are seasonal products. While we aim to match the website photos exactly, we reserve the right to substitute blooms of equal or greater value to ensure your arrangement is fresh and of the highest quality."
    },
    {
      title: "Delivery & Logistics",
      icon: <Truck size={20} />,
      content: "Orders must be placed by 11:00 AM for same-day delivery. If the recipient is unavailable, our couriers will leave the flowers in a secure, shaded area. We are not responsible for theft or weather-related damage after the drop-off."
    },
    {
      title: "Freshness & Claims",
      icon: <AlertCircle size={20} />,
      content: "Any quality concerns must be reported within 24 hours of delivery with a clear photograph. Due to the perishable nature of flowers, we cannot offer replacements for claims made after this window."
    },
    {
      title: "Cancellations",
      icon: <RefreshCw size={20} />,
      content: "Standard orders can be cancelled 24 hours before the delivery date. Custom event installations and wedding commissions require a 14-day notice for cancellation and a non-refundable deposit."
    },
    {
      title: "Payments & Pricing",
      icon: <CreditCard size={20} />,
      content: "All prices are in Rands. During peak holidays (Valentine's Day, Mother's Day), prices may fluctuate based on global market demand for premium stems."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <ScrollText className="mx-auto mb-6 text-[#c5a059]" size={40} />
          <h1 className="text-5xl md:text-6xl font-serif italic mb-4">Terms of Service</h1>
          <p className="text-stone-400 font-light tracking-widest uppercase text-[10px]">The Liora Bloom Standard</p>
        </header>

        <div className="bg-white rounded-[3rem] p-10 md:p-20 shadow-xl border border-stone-100">
          <div className="space-y-16">
            {terms.map((term, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-4 md:-left-12 top-0 text-[#c5a059] font-serif italic text-4xl opacity-20">0{idx + 1}</span>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#c5a059]">{term.icon}</span>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-stone-900">{term.title}</h3>
                </div>
                <p className="text-stone-600 leading-relaxed font-serif italic text-xl">
                  {term.content}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 pt-10 border-t border-stone-100 text-center">
            <p className="text-stone-400 text-xs">
              By accessing our 'Bloom Finder' and purchasing from Liora Bloom, you agree to these terms in full.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}