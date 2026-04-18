"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * Lamp container — radial light effect for the hero. Uses brand accent
 * (#3182ce) and light-accent (#bee3f8) instead of off-brand cyan.
 */
export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent w-full z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        {/* Left conic light */}
        <motion.div
          initial={{ opacity: 0.5, width: "60vw" }}
          whileInView={{ opacity: 1, width: "100vw" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[100vw] bg-gradient-conic from-[#3182ce] via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-surface-page h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-surface-page bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right conic light */}
        <motion.div
          initial={{ opacity: 0.5, width: "60vw" }}
          whileInView={{ opacity: 1, width: "100vw" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          className="absolute inset-auto left-1/2 h-56 w-[100vw] bg-gradient-conic from-transparent via-transparent to-[#3182ce] text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-surface-page bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-surface-page h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Center base bar + halo */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-[2] bg-surface-page blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-full -translate-y-1/2 rounded-full bg-[#3182ce] opacity-50 blur-3xl" />

        <motion.div
          initial={{ width: "40vw" }}
          whileInView={{ width: "80vw" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-[80vw] -translate-y-[6rem] rounded-full bg-[#bee3f8] blur-2xl"
        />
        <motion.div
          initial={{ width: "60vw" }}
          whileInView={{ width: "100vw" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-full -translate-y-[7rem] bg-[#bee3f8]"
        />

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-surface-page" />
      </div>

      <div className="relative z-50 flex -translate-y-24 sm:-translate-y-28 md:-translate-y-32 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};
