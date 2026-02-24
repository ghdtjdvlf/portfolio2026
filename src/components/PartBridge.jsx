import { motion } from 'framer-motion';

export default function PartBridge({ id, part, subtitle, subtitleKo, desc, color }) {
  return (
    <motion.div
      id={id}
      data-program-snap="true"
      className="w-full flex flex-col items-center justify-center py-20 px-6 text-center"
      style={{ background: '#09090b', minHeight: '100vh' }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="rounded-full mb-6"
        style={{ width: '48px', height: '3px', background: color }}
      />
      <p
        className="text-sm font-bold tracking-[0.3em] uppercase mb-3"
        style={{ color }}
      >
        {part}
      </p>
      <h2
        className="font-black text-white leading-none mb-2"
        style={{ fontSize: 'clamp(2.8rem, 10vw, 5rem)' }}
      >
        {subtitle}
      </h2>
      <p className="text-zinc-500 text-base mb-4">{subtitleKo}</p>
      <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">{desc}</p>
    </motion.div>
  );
}
