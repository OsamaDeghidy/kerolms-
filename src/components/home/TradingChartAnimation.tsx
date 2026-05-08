"use client";

import { motion } from "framer-motion";

export default function TradingChartAnimation() {
  return (
    <div className="flex gap-4 items-end w-full h-full p-20 select-none opacity-20">
       {[...Array(60)].map((_, i) => (
         <motion.div 
            key={i}
            className={`w-6 rounded-t-3xl ${i % 8 === 0 ? 'bg-rose-500/30' : 'bg-primary/20'}`}
            animate={{ 
              height: [100, 300, 150, 400, 200][i % 5] + "px"
            }}
            transition={{ 
              duration: 4 + (i * 0.1), 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "circInOut"
            }}
         />
       ))}
    </div>
  )
}
