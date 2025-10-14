'use client';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        className="relative w-32 h-32"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      >
        {/* Círculo hipnótico */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="spiralGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60a5fa" /> {/* azul */}
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Espiral */}
          <path
            d="M50 50 m0,-40 
            a40,40 0 1,1 0,80 
            a30,30 0 1,0 0,-60 
            a20,20 0 1,1 0,40 
            a10,10 0 1,0 0,-20"
            fill="none"
            stroke="url(#spiralGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Texto opcional */}
      <motion.p
        className="absolute bottom-20 text-white text-lg font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Cargando...
      </motion.p>
    </div>
  );
}
