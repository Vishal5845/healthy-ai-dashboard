"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";

interface Props {
  label: string;
  value: number;
  suffix?: string;
}

export function MetricCard({
  label,
  value,
  suffix,
}: Props) {

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      whileHover={{
        y: -4,
      }}
      className="
        rounded-[28px]
        border border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
        transition-all
      "
    >
      <p className="mb-3 text-sm text-white/60">
        {label}
      </p>
      <h3 className="text-4xl font-bold tracking-tight">
        <CountUp
          end={value}
          duration={1}
        />
        {suffix}
      </h3>
    </motion.div>
  );
}