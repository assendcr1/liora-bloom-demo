// src/pages/OurStory.jsx
import {
  ShieldCheck,
  Sparkles,
  Sun,
  HandHeart,
} from "lucide-react";

export default function OurStory() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-stone-200">
        <img
          src="https://images.pexels.com/photos/35062137/pexels-photo-35062137.jpeg"
          alt="Liora Floral Studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-#c5a059300 mb-6">
            Established September 2025
          </p>
          <h1 className="text-6xl md:text-8xl font-light text-white tracking-tight mb-8">
            Our <span className="italic font-serif">Story</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Pronounced <span className="italic">LEE-ur-ruh</span>, our name means "my light." 
            We are a floral design house dedicated to the belief that even the smallest gesture can illuminate a life.
          </p>
        </div>
      </section>

      {/* THE MEANING */}
      <section className="px-6 md:px-12 py-32 max-w-6xl mx-auto grid md:grid-cols-2 gap-24 items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-#c5a059 mb-8">
            The Essence of Liora
          </p>
          <h2 className="text-5xl font-light mb-10 italic font-serif text-stone-800">
            Bringing Light and Happiness.
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed mb-6">
            LIORA was created with a simple yet powerful purpose: to bring more light into the world through flowers. 
            To us, flowers are more than décor—they are expressions of love, celebration, comfort, and deep connection.
          </p>
          <p className="text-stone-600 text-lg leading-relaxed">
            What began as a vision to spread positivity has grown into a dedicated floral design business 
            focused on custom-crafted arrangements that illuminate life’s most special moments.
          </p>
        </div>
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Liora Floral Artistry"
            className="rounded-[3rem] shadow-2xl"
          />
          <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-xl hidden lg:block max-w-xs">
            <p className="text-sm italic font-serif text-stone-500">
              "We want people to think of light—light in moments of joy, and light in times of need."
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION STRIP */}
      <section className="bg-stone-900 py-32 text-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-#c5a059400 mb-6">Our Mission</h3>
            <p className="text-3xl font-light font-serif leading-snug">
              To transform ordinary days into extraordinary ones through intentional, high-quality designs that celebrate every milestone.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-#c5a059400 mb-6">Our Vision</h3>
            <p className="text-3xl font-light font-serif leading-snug">
              To become a recognized symbol of hope and beauty, inspiring joy through the timeless language of flowers.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-6 md:px-12 py-36 max-w-7xl mx-auto">
        <h2 className="text-5xl font-light italic font-serif text-center mb-24">
          Guided by Light
        </h2>

        <div className="grid md:grid-cols-4 gap-16 text-center">
          <div>
            <Sun className="mx-auto mb-6 text-#c5a059400" size={36} strokeWidth={1.5} />
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Positivity</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              We believe a single bouquet can brighten a day and offer warmth.
            </p>
          </div>
          <div>
            <HandHeart className="mx-auto mb-6 text-#c5a059400" size={36} strokeWidth={1.5} />
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Authenticity</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Genuine care and heartfelt service are at the root of every stem we place.
            </p>
          </div>
          <div>
            <Sparkles className="mx-auto mb-6 text-#c5a059400" size={36} strokeWidth={1.5} />
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Artistry</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Every arrangement is a custom-crafted reflection of your unique story.
            </p>
          </div>
          <div>
            <ShieldCheck className="mx-auto mb-6 text-#c5a059400" size={36} strokeWidth={1.5} />
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Quality</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Carefully selected blooms ensuring what you give is meaningful and lasting.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-6 md:px-12 py-36 bg-[#faf9f6] text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-stone-400 mb-8">Lighting the world, one bouquet at a time.</p>
        <p className="text-4xl md:text-5xl font-light font-serif italic text-stone-800 mb-12 max-w-4xl mx-auto">
          Every bloom is arranged with purpose, ensuring your gift is as meaningful as it is beautiful.
        </p>

        <a
          href="/collections"
          className="inline-block bg-stone-900 text-white px-14 py-5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-#c5a059 transition shadow-xl"
        >
          Share the Light
        </a>
      </section>
    </>
  );
}