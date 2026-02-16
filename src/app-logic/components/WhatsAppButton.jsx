import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/0000000000?text=Hi%20Liora%20Bloom,%20I%20need%20help%20choosing%20flowers."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-xl hover:scale-105 transition"
    >
      <MessageCircle />
    </a>
  );
}
