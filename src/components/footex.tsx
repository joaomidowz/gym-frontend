import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full py-6 text-primary flex flex-col items-center justify-center gap-2">
      <a
        href="https://www.instagram.com/joaomidowz"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:text-pink-500 transition"
      >
        <FaInstagram size={24} />
        <span>@joaomidowz</span>
      </a>

      <p className="text-sm text-primary">© {new Date().getFullYear()} Todos os direitos reservados a joaomidowz.</p>
    </footer>
  );
}
