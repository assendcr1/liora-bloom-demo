import React from 'react';
import { ShieldCheck, Eye, Lock, Globe, Database, Bell } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information Collection",
      icon: <Eye size={20} />,
      content: "We collect personal information such as your name, email address, delivery address, and phone number when you place an order. This data is used exclusively to fulfill your floral requests and communicate order status."
    },
    {
      title: "AI Personalization",
      icon: <Globe size={20} />,
      content: "When using our 'Bloom Finder' AI, the prompts you enter are processed to provide curated matches. We do not link these prompts to your identity for marketing purposes, nor do we sell your emotional intent data to third parties."
    },
    {
      title: "Secure Transactions",
      icon: <Lock size={20} />,
      content: "All payments are processed through secure, PCI-DSS compliant gateways. Liora Bloom never stores your raw credit card data on our servers."
    },
    {
      title: "Data Retention",
      icon: <Database size={20} />,
      content: "We retain your order history to provide better service for future purchases. You may request the deletion of your account and associated data at any time via our support channels."
    },
    {
      title: "Marketing Communications",
      icon: <Bell size={20} />,
      content: "If you opt-in to our newsletter, we may send seasonal collection updates. You can unsubscribe at any time using the link at the footer of our emails."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <ShieldCheck className="mx-auto mb-6 text-[#c5a059]" size={40} />
          <h1 className="text-5xl md:text-6xl font-serif italic mb-4 text-stone-900">Privacy Policy</h1>
          <p className="text-stone-400 font-light tracking-widest uppercase text-[10px]">Version 1.2 • Effective February 2026</p>
        </header>

        <div className="grid gap-8">
          {sections.map((section, idx) => (
            <section key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100">
              <div className="flex items-center gap-4 mb-6 text-[#c5a059]">
                {section.icon}
                <h2 className="text-2xl font-serif italic text-stone-800">{section.title}</h2>
              </div>
              <p className="text-stone-600 leading-relaxed font-light">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-16 text-center text-stone-400 text-sm italic">
          Questions regarding your data? Reach out to privacy@liorabloom.com
        </footer>
      </div>
    </div>
  );
}