"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SecurityWatermarkProps {
  email: string;
}

export default function SecurityWatermark({ email }: SecurityWatermarkProps) {
  const [position, setPosition] = useState({ top: "20%", left: "20%" });

  useEffect(() => {
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 80) + 10 + "%";
      const left = Math.floor(Math.random() * 80) + 10 + "%";
      setPosition({ top, left });
    }, 15000); // Move every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden opacity-[0.1] select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${position.top}-${position.left}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          style={{ 
            position: "absolute", 
            top: position.top, 
            left: position.left,
            transform: "translate(-50%, -50%) rotate(-15deg)",
            textShadow: "0 0 10px rgba(0,0,0,0.5)"
          }}
          className="whitespace-nowrap font-black text-xl tracking-[0.5em] text-white"
        >
          {email} • SECURE STREAM • {new Date().toLocaleDateString()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
