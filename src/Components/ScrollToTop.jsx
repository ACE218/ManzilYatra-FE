import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="scroll-to-top"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
        >
          {/* Progress Ring */}
          <svg className="progress-ring" width="50" height="50">
            <circle
              className="progress-ring-circle-bg"
              cx="25"
              cy="25"
              r="20"
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="2"
            />
            <circle
              className="progress-ring-circle"
              cx="25"
              cy="25"
              r="20"
              fill="transparent"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                strokeDasharray: `${2 * Math.PI * 20}`,
                strokeDashoffset: `${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`,
              }}
            />
          </svg>
          
          {/* Arrow Icon */}
          <ChevronUp size={20} className="scroll-icon" />
          
          <style jsx>{`
            .scroll-to-top {
              position: fixed;
              bottom: 2rem;
              right: 2rem;
              z-index: 1000;
              width: 50px;
              height: 50px;
              background: var(--gradient-primary);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              box-shadow: var(--shadow-lg);
              color: white;
              transition: all 0.3s ease;
              position: relative;
            }

            .scroll-to-top:hover {
              box-shadow: var(--shadow-xl);
            }

            .progress-ring {
              position: absolute;
              top: 0;
              left: 0;
              transform: rotate(-90deg);
            }

            .progress-ring-circle {
              transition: stroke-dashoffset 0.1s ease;
            }

            .scroll-icon {
              position: relative;
              z-index: 2;
            }

            @media (max-width: 768px) {
              .scroll-to-top {
                bottom: 1.5rem;
                right: 1.5rem;
                width: 45px;
                height: 45px;
              }

              .progress-ring {
                width: 45px;
                height: 45px;
              }

              .progress-ring-circle-bg,
              .progress-ring-circle {
                cx: 22.5;
                cy: 22.5;
                r: 18;
              }

              .scroll-icon {
                width: 18px;
                height: 18px;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ScrollToTop;