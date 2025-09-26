"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, MotionProps } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CharacterSet = string[] | readonly string[];

interface HyperTextProps extends MotionProps {
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
  animateOnHover?: boolean;
  characterSet?: CharacterSet;
}

const DEFAULT_CHARACTER_SET = Object.freeze(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
) as readonly string[];

const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

export function HyperText({
                            className,
                            duration = 1500,
                            delay = 0,
                            as: Component = "div",
                            startOnView = false,
                            animateOnHover = true,
                            characterSet = DEFAULT_CHARACTER_SET,
                            ...props
                          }: HyperTextProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  // 👉 Texte codé en dur
  const text = "CHOISIS LES SNEAKERS QUE TU VEUX REVOIR.";

  // repérae des index du mot "revoir"
  const targetWord = "revoir.";
  const startIndex = text.toLowerCase().indexOf(targetWord);
  const accentIndexes =
      startIndex !== -1
          ? Array.from({ length: targetWord.length }, (_, k) => startIndex + k)
          : [];

  const [displayText, setDisplayText] = useState<string[]>(() =>
      text.split(""),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const iterationCount = useRef(0);
  const elementRef = useRef<HTMLElement>(null);

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating) {
      iterationCount.current = 0;
      setIsAnimating(true);
    }
  };

  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => setIsAnimating(true), delay);
      return () => clearTimeout(startTimeout);
    }

    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsAnimating(true), delay);
            observer.disconnect();
          }
        },
        { threshold: 0.1 },
    );

    if (elementRef.current) observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [delay, startOnView]);

  // animation scramble progressive
  useEffect(() => {
    if (!isAnimating) return;

    const maxIterations = text.length;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const revealedCount = Math.floor(progress * maxIterations);

      setDisplayText(
          text.split("").map((letter, index) => {
            if (letter === " ") return " ";
            if (index <= revealedCount) return text[index];
            return characterSet[getRandomInt(characterSet.length)];
          }),
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [text, duration, isAnimating, characterSet]);

  return (
      <MotionComponent
          ref={elementRef}
          className={cn("overflow-hidden py-2 text-4xl font-bold text-white", className)}
          onMouseEnter={handleAnimationTrigger}
          {...props}
      >
        <AnimatePresence>
          {displayText.map((char, i) => (
              <motion.span
                  key={i}
                  className={cn(
                      "font-mono",
                      char === " " ? "w-3" : "",
                      accentIndexes.includes(i) && "text-accent" // ✅ applique la couleur sur toutes les lettres du mot
                  )}
              >
                {char}
              </motion.span>
          ))}
        </AnimatePresence>
      </MotionComponent>
  );
}
