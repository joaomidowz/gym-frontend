import Footer from "@/components/footer";
import Image from "next/image";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 px-4 text-center">
      <h1 className="text-primary text-4xl">Bem-vindo à <span className="text-accent font-bold">Midowz Gym💪</span></h1>

      <div className="border border-primary rounded-2xl p-10 shadow-lg flex flex-col gap-10">
        <button className="bg-primary rounded-2xl text-white text-xl py-3 px-6 hover:bg-primary/80 transition">Comece agora!</button>
        <button className="bg-primary rounded-2xl text-white text-xl py-3 px-6 hover:bg-primary/80 transition">Entrar</button>
      </div>
      <Footer />
    </div>

  );
}
