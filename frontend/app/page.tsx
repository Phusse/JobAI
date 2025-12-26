import type { Metadata } from 'next';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: "Free Career Assessment - Find Your Perfect Career Path",
  description: "Take our free 5-minute career personality quiz. Answer 20 simple questions about your everyday habits and discover which tech career matches your natural thinking style. No experience needed.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
