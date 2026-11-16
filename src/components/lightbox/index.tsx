"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { ChevronLeft, ChevronRight, X, Video } from "lucide-react";

export interface LightboxAsset {
  type: "image" | "video";
  url: string;
  alt?: string;
  title?: string;
  description?: string;
}

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  assets: LightboxAsset[];
  initialIndex?: number;
  title?: string;
  showThumbnails?: boolean;
  loop?: boolean;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 320, damping: 32 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.25 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : direction > 0 ? "-100%" : 0,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring" as const, stiffness: 320, damping: 32 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.25 },
    },
  }),
};

const reducedMotionVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export function Lightbox({
  isOpen,
  onClose,
  assets,
  initialIndex = 0,
  title,
  showThumbnails = true,
  loop = true,
}: Readonly<LightboxProps>) {
  const [mounted, setMounted] = useState(false);
  const [[currentIndex, direction], setPage] = useState<[number, number]>([
    initialIndex,
    0,
  ]);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const totalAssets = assets.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setPage([initialIndex, 0]);
    }
  }, [isOpen, initialIndex]);

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prevIndex]) => {
        let nextIndex = prevIndex + newDirection;
        if (loop) {
          nextIndex = (nextIndex + totalAssets) % totalAssets;
        } else {
          nextIndex = Math.max(0, Math.min(nextIndex, totalAssets - 1));
        }
        return [nextIndex, newDirection];
      });
    },
    [loop, totalAssets],
  );

  const goToIndex = useCallback((index: number) => {
    setPage(([prevIndex]) => {
      const dir = index > prevIndex ? 1 : index < prevIndex ? -1 : 0;
      return [index, dir];
    });
  }, []);

  const showNext = useCallback(() => paginate(1), [paginate]);
  const showPrev = useCallback(() => paginate(-1), [paginate]);

  // Lock body scroll and handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        showNext();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, showNext, showPrev]);

  // Keep active thumbnail centered in view
  useEffect(() => {
    if (isOpen && thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [isOpen, currentIndex]);

  if (!mounted || !assets.length) return null;

  const currentAsset = assets[currentIndex] || assets[0];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="lightbox-container"
          role="dialog"
          aria-modal="true"
          aria-label={
            title
              ? `${title} - asset ${currentIndex + 1} of ${totalAssets}`
              : `Asset lightbox ${currentIndex + 1} of ${totalAssets}`
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] w-full h-full bg-black/95 backdrop-blur-md flex flex-col justify-between select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Top Bar: Title, Counter & Close */}
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between text-white border-b border-white/10 bg-black/60 backdrop-blur shrink-0 z-20">
            <div className="flex items-center gap-3 min-w-0">
              {title && (
                <span className="text-sm font-semibold tracking-wide truncate max-w-[200px] sm:max-w-md">
                  {title}
                </span>
              )}
              <span className="text-xs text-white/70 font-mono bg-white/10 px-2.5 py-0.5 rounded-full shrink-0">
                {currentIndex + 1} / {totalAssets}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-gold hover:text-navy text-white text-xs font-semibold transition-colors cursor-pointer"
                aria-label="Close lightbox (Esc)"
              >
                <X size={16} />
                <span className="hidden sm:inline">Close</span>
                <kbd className="hidden sm:inline text-[0.65rem] text-white/70 font-mono bg-black/50 px-1 py-0.5 rounded border border-white/10">
                  Esc
                </kbd>
              </button>
            </div>
          </div>

          {/* Center Stage: Active Asset with Slide Animation & Navigation Controls */}
          <div
            className="relative flex-1 flex items-center justify-center p-3 sm:p-6 min-h-0 overflow-hidden w-full"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            {/* Prev Button */}
            {totalAssets > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-3 sm:left-6 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-gold hover:text-navy text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border border-white/15 shadow-xl active:scale-95"
                aria-label="Previous asset (Left Arrow)"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            {/* Slide-Animated Asset Container */}
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={
                  shouldReduceMotion ? reducedMotionVariants : slideVariants
                }
                initial="enter"
                animate="center"
                exit="exit"
                drag={shouldReduceMotion ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -800 || offset.x < -80) {
                    showNext();
                  } else if (swipe > 800 || offset.x > 80) {
                    showPrev();
                  }
                }}
                className="max-h-full max-w-full flex items-center justify-center select-none"
                onClick={(e) => e.stopPropagation()}
              >
                {currentAsset.type === "image" ? (
                  <img
                    src={currentAsset.url}
                    alt={
                      currentAsset.alt || title || `Asset ${currentIndex + 1}`
                    }
                    className="max-h-[calc(100vh-170px)] max-w-[calc(100vw-80px)] sm:max-w-[calc(100vw-160px)] object-contain rounded shadow-2xl transition-all duration-200 pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <video
                    src={currentAsset.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[calc(100vh-170px)] max-w-[calc(100vw-80px)] sm:max-w-[calc(100vw-160px)] object-contain rounded bg-black shadow-2xl"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Next Button */}
            {totalAssets > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-3 sm:right-6 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-gold hover:text-navy text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border border-white/15 shadow-xl active:scale-95"
                aria-label="Next asset (Right Arrow)"
              >
                <ChevronRight size={26} />
              </button>
            )}
          </div>

          {/* Bottom Bar: Caption & Thumbnails */}
          <div className="p-3 sm:p-4 bg-black/85 border-t border-white/10 flex flex-col items-center gap-2.5 shrink-0 z-20">
            {/* Caption */}
            {currentAsset.alt && (
              <p className="text-xs sm:text-sm text-white/90 text-center m-0 max-w-2xl truncate">
                {currentAsset.alt}
              </p>
            )}

            {/* Thumbnails Strip */}
            {showThumbnails && totalAssets > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {assets.map((asset, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={idx}
                      ref={(el) => {
                        thumbnailRefs.current[idx] = el;
                      }}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToIndex(idx);
                      }}
                      className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded overflow-hidden shrink-0 transition-all cursor-pointer ${
                        isActive
                          ? "ring-2 ring-gold scale-105 border-gold shadow-lg opacity-100"
                          : "opacity-45 hover:opacity-100 border border-white/20"
                      }`}
                      aria-label={`Jump to asset ${idx + 1}`}
                    >
                      {asset.type === "image" ? (
                        <img
                          src={asset.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-navy/90 flex items-center justify-center text-white">
                          <Video size={14} className="text-gold" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
