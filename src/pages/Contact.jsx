// src/pages/Contact.jsx
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Sparkles,
  MessageCircle,
  Send,
} from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* HERO – FIXED OFFSET SAFE */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-stone-900 text-white overflow-hidden pt-20">
        {/* background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-900/90 to-black" />

        {/* content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-#c5a059300 mb-6">
            Get in Touch
          </p>
          <h1 className="text-6xl md:text-7xl font-light tracking-tight mb-6">
            Let’s Create
            <span className="italic font-serif"> Something Meaningful</span>
          </h1>
          <p className="text-white/80 text-lg font-light leading-relaxed">
            Whether you’re celebrating, apologising, or expressing something
            unspoken — we’re here to help you do it beautifully.
          </p>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16 text-center mb-32">
          <div>
            <Mail className="mx-auto mb-6 text-#c5a059400" size={36} />
            <p className="text-xs font-black uppercase tracking-widest mb-2">
              Email Us
            </p>
            <p className="text-stone-500 text-sm">
              hello@liorabloom.co.za
            </p>
          </div>

          <div>
            <Phone className="mx-auto mb-6 text-#c5a059400" size={36} />
            <p className="text-xs font-black uppercase tracking-widest mb-2">
              Call Us
            </p>
            <p className="text-stone-500 text-sm">
              +27 00 000 0000
            </p>
          </div>

          <div>
            <MapPin className="mx-auto mb-6 text-#c5a059400" size={36} />
            <p className="text-xs font-black uppercase tracking-widest mb-2">
              Studio Location
            </p>
            <p className="text-stone-500 text-sm">
              Sandton, Johannesburg
            </p>
          </div>
        </div>

        {/* MAIN CONTACT EXPERIENCE */}
        <div className="grid md:grid-cols-2 gap-24 items-start">
          {/* LEFT COPY */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-#c5a059 mb-6">
              Start a Conversation
            </p>
            <h2 className="text-5xl font-light italic font-serif mb-8">
              Every arrangement begins with understanding
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-10">
              Tell us what you’re trying to express. Our team — and our Bloom
              Finder system — will guide you toward a floral composition that
              feels intentional, personal, and precise.
            </p>

            <div className="flex items-center gap-4 text-stone-500 text-sm">
              <Sparkles size={18} className="text-#c5a059400" />
              Responses typically within the same business day
            </div>

            <div className="mt-10">
              <a
                href="https://wa.me/0000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-widest border-b border-black pb-1"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-[3rem] shadow-2xl p-12">
            <form className="space-y-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                  Your Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border-b border-stone-300 py-4 outline-none focus:border-#c5a059 transition"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border-b border-stone-300 py-4 outline-none focus:border-#c5a059 transition"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2">
                  What would you like to express?
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border-b border-stone-300 py-4 outline-none focus:border-#c5a059 transition h-32 resize-none"
                  placeholder="Describe the moment, emotion, or occasion…"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-#c5a059 transition flex items-center justify-center gap-3"
              >
                <Send size={16} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SIGN-OFF */}
      <section className="px-6 md:px-12 py-32 bg-[#faf9f6] text-center">
        <p className="text-3xl md:text-4xl font-light font-serif italic text-stone-800 mb-6">
          The right flowers say what words cannot.
        </p>
        <p className="text-stone-500">
          We’ll help you find them.
        </p>
      </section>
    </>
  );
}
