'use client';

import { ParallaxProvider, ParallaxBanner } from 'react-scroll-parallax';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { belovedWomen, Person } from '../data';

const GreetingCard = ({ person }: { person: Person }) => {
  return (
    <motion.div 
      className="bg-white rounded-[40px] overflow-hidden shadow-[0_15px_40px_rgba(216,27,96,0.15)] flex flex-col border border-[#ffebee]"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <img 
        src={person.photo} 
        alt={person.role} 
        className="w-full h-[500px] md:h-[700px] object-cover bg-pink-200" 
        onError={(e) => { e.currentTarget.style.display = 'none' }} 
      />
      <div className="p-10 md:p-16 text-center relative z-10 bg-white">
        <h3 className="text-[#d81b60] text-4xl md:text-5xl font-bold mb-6">
          {person.role} {person.name ? `(${person.name})` : ''} ❤️
        </h3>
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-4">
          {person.greeting}
        </p>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const timer = setTimeout(() => setIsConfettiActive(false), 10000); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const playMusic = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setIsMusicPlaying(true);
        }
      } catch (err) {
        console.log("Автоплей заблокирован браузером. Ждем тапа по экрану.");
      }
    };

    playMusic();

    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play();
        setIsMusicPlaying(true);
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }, 6000);
    return () => clearTimeout(scrollTimer);
  }, []);

  return (
    // @ts-ignore
    <ParallaxProvider>
      <main className="min-h-screen bg-[#fff9fa] font-sans overflow-x-hidden">
        
        {isConfettiActive && windowSize.width > 0 && (
          <Confetti 
            width={windowSize.width} 
            height={windowSize.height} 
            recycle={false} 
            numberOfPieces={300} 
            colors={['#FFD700', '#FFB6C1', '#d81b60']} 
          />
        )}

        {/* Главный экран */}
        <section className="h-[50vh] md:h-screen relative">
          <ParallaxBanner
            layers={[
              { 
                image: '/images/Main_photo.jpg', 
                speed: -20,
                // Это заставит фото отцентрироваться и не обрезать головы
                style: { backgroundPosition: 'center 30%' } 
              }
            ]}
            className="!h-[50vh] md:!h-screen"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 text-center p-5">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                <h1 className="text-5xl md:text-7xl font-bold text-[#d81b60] mb-2 drop-shadow-md">
                  <span className="text-[8rem] md:text-[12rem] block text-[#ff4081] drop-shadow-[0_0_20px_rgba(255,64,129,0.5)] -mb-4 md:-mb-8">8</span><br />
                  Наурыз
                </h1>
                <p className="text-xl md:text-2xl text-gray-800 max-w-2xl bg-white/70 px-6 py-3 rounded-2xl mt-4 inline-block font-medium shadow-sm">
                  Біздің отбасыдағы ең қымбат және әсем қыздарына
                </p>
              </motion.div>
            </div>
          </ParallaxBanner>
        </section>

        {/* Обновленная секция с красивым геометрическим паттерном на фоне */}
        <div className="relative w-full bg-[#fff9fa] bg-[radial-gradient(#f8bbd0_3px,transparent_3px)] bg-[size:40px_40px]">
          <section className="relative z-10 py-24 px-5 max-w-6xl mx-auto flex flex-col gap-24">
            {belovedWomen.map((person) => (
              <GreetingCard key={person.id} person={person} />
            ))}
          </section>
        </div>

        <footer className="text-center py-10 px-5 bg-[#fce4ec] text-[#880e4f] text-lg font-medium">
          <p>Сайтты жасаған <strong>Мансұр</strong>. Шын жүректен ❤️</p>
        </footer>

        <button 
          onClick={toggleMusic} 
          className="fixed bottom-8 right-8 bg-[#d81b60] hover:bg-[#ad1457] text-white border-none py-3 px-6 rounded-full text-lg cursor-pointer shadow-[0_4px_15px_rgba(216,27,96,0.4)] z-50 transition-colors"
        >
          {isMusicPlaying ? '🔈 Пауза' : '🎵 Включить музыку'}
        </button>
        
        <audio ref={audioRef} loop src="/audio/music.mp3" autoPlay></audio>
      </main>
    </ParallaxProvider>
  );
}