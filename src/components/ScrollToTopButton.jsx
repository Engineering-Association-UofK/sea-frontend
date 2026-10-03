import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  const toggleVisibility = () => {
    // Show only after scrolling 500px for a less "jumpy" feel
    if (window.pageYOffset > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Logic: If bot is on the left (RTL), button is on the right.
  // If bot is on the right (LTR), button is on the left.
  const positionClass = dir === "rtl" ? "end-0 me-4" : "start-0 ms-4";

  return (
    <>
      <style>
        {`
        /* Scroll to Top Button Styling */
.scroll-top-container {
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1040;
}

.scroll-top-btn {
    width: 50px; /* Slightly smaller than the bot FAB to show hierarchy */
    height: 50px;
    background-color: #ffffff; /* White background with colored icon looks cleaner */
    color: var(--bot-primary);
    border: 2px solid var(--bot-primary);
    transition: all 0.3s ease;
}

.scroll-top-btn:hover {
    background-color: var(--bot-primary);
    color: white;
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(34, 178, 230, 0.3);
}

/* Entry Animation */
.scroll-enter {
    opacity: 1;
    transform: scale(1);
}

.scroll-exit {
    opacity: 0;
    transform: scale(0.5);
    pointer-events: none;
}
        `}
      </style>
      <div
        className={`fixed bottom-0 mb-4 ${positionClass} scroll-top-container ${
          isVisible ? "scroll-enter" : "scroll-exit"
        }`}
      >
        <button
          onClick={scrollToTop}
          className="btn rounded-circle shadow-sm d-flex align-items-center justify-content-center scroll-top-btn"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default ScrollToTopButton;
