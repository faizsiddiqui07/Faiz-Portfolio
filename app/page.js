// app/page.js
'use client'; // Ye bahut zaroori hai animations ke liye

import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  memo,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useVelocity,
  useMotionValue,
  useMotionTemplate,
  useInView,
} from "framer-motion";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Terminal,
  Cpu,
  Globe,
  MessageSquare,
  Bot,
  X,
  Send,
  Loader2,
  Download,
} from "lucide-react";
import { ReactLenis } from 'lenis/react';
import Background from './components/Background'; // Path check kar lena

// --- Components (SpotlightCard, Preloader etc.) wahi same rahenge ---

const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleFocus = () => opacity.set(1);
  const handleBlur = () => opacity.set(0);

  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent 40%)`;

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{ opacity, background }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

const Preloader = ({ setLoading }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [setLoading]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white"
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-gray-500"
        >
          Loading Experience
        </motion.p>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter">
          {count}%
        </h1>
      </div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 50, stiffness: 1000 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 bg-white rounded-full pointer-events-none z-50 hidden md:block mix-blend-difference"
      style={{ x, y }}
    />
  );
};

const Navbar = memo(() => (
  <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-40 bg-white/5 backdrop-blur-xl border border-white/5 px-4 py-2 md:px-6 md:py-3 rounded-full flex items-center gap-4 md:gap-8 shadow-2xl transition-all hover:bg-white/10 hover:border-white/10 w-[90%] max-w-fit justify-between md:justify-center">
    <div className="flex gap-3 md:gap-6 text-xs md:text-sm font-medium text-gray-400 items-center">
      <a href="#work" className="hover:text-white transition-colors ">
        Work
      </a>
      <a href="#about" className="hover:text-white transition-colors">
        About
      </a>
      <a href="#contact" className="hover:text-white transition-colors">
        Connect
      </a>
      <a
        href="/Faiz Resume.pdf"
        download
        className="flex items-center gap-1 bg-white/10 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-white hover:text-black transition-all font-bold border border-white/10"
      >
        Resume <Download size={12} />
      </a>
    </div>
  </nav>
));

const Hero = () => {
  const targetRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const nameOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const nameScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const nameBlur = useTransform(scrollYProgress, [0.2, 0.3], ["0px", "10px"]);

  const roleOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.8, 0.95],
    [0, 1, 1, 0],
  );
  const roleScale = useTransform(scrollYProgress, [0.35, 0.95], [0.9, 1.1]);
  const roleBlur = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.8, 0.95],
    ["10px", "0px", "0px", "10px"],
  );
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.1],
    [1, 0],
  );

  const frameCount = 210;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const render = (progress) => {
      const safeProgress = Math.max(0, Math.min(1, progress));
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(safeProgress * frameCount),
      );

      if (imagesRef.current.length === 0) return;

      const img = imagesRef.current[frameIndex];

      if (img && img.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        context.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio,
        );

        if (!isCanvasReady) setIsCanvasReady(true);
      }
    };

    const updateDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(scrollYProgress.get());
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const imgFirst = new Image();
    imgFirst.src = "/ezgif-frame-001.jpg";
    imgFirst.onload = () => {
      const hRatio = canvas.width / imgFirst.width;
      const vRatio = canvas.height / imgFirst.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - imgFirst.width * ratio) / 2;
      const centerShift_y = (canvas.height - imgFirst.height * ratio) / 2;

      context.drawImage(
        imgFirst,
        0,
        0,
        imgFirst.width,
        imgFirst.height,
        centerShift_x,
        centerShift_y,
        imgFirst.width * ratio,
        imgFirst.height * ratio,
      );
      setIsCanvasReady(true);
    };

    if (imagesRef.current.length === 0) {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const formattedIndex = i.toString().padStart(3, "0");
        img.src = `/ezgif-frame-${formattedIndex}.jpg`;
        imagesRef.current.push(img);
      }
    }

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      requestAnimationFrame(() => render(latest));
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [scrollYProgress]);

  return (
    <section ref={targetRef} className="h-[1000vh] relative bg-black">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/ezgif-frame-001.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
            loading="eager"
            style={{
              opacity: isCanvasReady ? 0 : 1,
              transition: "opacity 0.5s ease",
            }}
          />
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 transition-opacity duration-500"
          style={{ opacity: isCanvasReady ? 1 : 0 }}
        />

        <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />

        <motion.div
          style={{
            opacity: nameOpacity,
            scale: nameScale,
            filter: `blur(${nameBlur})`,
          }}
          className="absolute z-20 text-center px-4 w-full"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white tracking-tighter leading-none mix-blend-overlay">
            FAIZ
          </h1>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-transparent stroke-text tracking-tighter leading-none opacity-80"
            style={{ WebkitTextStroke: "2px white" }}
          >
            SIDDIQUI
          </h1>
        </motion.div>

        <motion.div
          style={{
            opacity: roleOpacity,
            scale: roleScale,
            filter: `blur(${roleBlur})`,
          }}
          className="absolute z-20 text-center px-4"
        >
          <div className="w-16 md:w-20 h-1 bg-white mx-auto mb-4 md:mb-6 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          <h2 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white tracking-widest uppercase leading-tight drop-shadow-2xl">
            Software
            <br />
            <span className="text-gray-400">Engineer.</span>
          </h2>
          <p className="mt-4 md:mt-6 text-sm md:text-xl text-gray-300 font-light tracking-widest uppercase">
            Building the Future
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 flex flex-col items-center gap-2 z-20"
        >
          <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-white to-transparent" />
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-white">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
};

const MarqueeText = () => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const skewX = useTransform(smoothVelocity, [-1000, 1000], [30, -30]);
  const scale = useTransform(smoothVelocity, [-1000, 0, 1000], [0.95, 1, 0.95]);

  return (
    <div className="py-8 md:py-12 overflow-hidden bg-black border-y border-white/5 relative z-20 cursor-default">
      <motion.div
        style={{ skewX, scale }}
        className="flex whitespace-nowrap origin-center"
      >
        <motion.div
          className="flex gap-10 md:gap-20"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-transparent tracking-tighter opacity-30 uppercase transition-all duration-300 hover:opacity-100 hover:text-white"
              style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.5)" }}
            >
              IDEAS • STRUCTURE • EXECUTION •
            </span>
          ))}
        </motion.div>

        <motion.div
          className="flex gap-10 md:gap-20 ml-10 md:ml-20"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-transparent tracking-tighter opacity-30 uppercase transition-all duration-300 hover:opacity-100 hover:text-white"
              style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.5)" }}
            >
              IDEAS • STRUCTURE • EXECUTION •
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Faiz's AI Assistant. Ask me anything about his work, skills, or experience.",
      sender: "bot",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg = { id: Date.now(), text: userText, sender: "user" };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // NOTE: Next.js uses process.env.NEXT_PUBLIC_...
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      const systemPrompt = `
  You are the AI interface for Faiz Siddiqui's portfolio...
  (Same prompt as before)
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
          }),
        },
      );

      const data = await response.json();
      const aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm having trouble connecting to my brain right now. Please try again later.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: aiResponse, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, I encountered a network error. Could you ask that again?",
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="fixed bottom-20 sm:bottom-24 right-4 md:right-10 w-[85vw] md:w-[380px] h-[500px] md:h-[550px] bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl z-[100] flex flex-col overflow-hidden ring-1 ring-white/5"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white leading-tight">
                    Faiz AI
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center mr-2 mt-auto shrink-0 border border-white/5">
                      <Bot size={12} className="text-gray-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-[#007AFF] text-white rounded-2xl rounded-br-sm"
                        : "bg-[#262629] text-gray-200 rounded-2xl rounded-bl-sm border border-white/5"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center mr-2 mt-auto shrink-0 border border-white/5">
                    <Bot size={12} className="text-gray-400" />
                  </div>
                  <div className="bg-[#262629] px-4 py-3 rounded-2xl rounded-bl-sm border border-white/5 flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-zinc-900/50 backdrop-blur-md">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !isTyping && handleSend()
                  }
                  placeholder="Ask about skills..."
                  disabled={isTyping}
                  className="flex-1 bg-black/40 border border-white/10 rounded-full py-3 px-5 text-sm focus:outline-none focus:border-white/20 focus:bg-black/60 transition-all placeholder:text-gray-600 text-white disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isTyping}
                  className={`w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors shrink-0 ${
                    isTyping ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isTyping ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} className="ml-0.5" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 w-10 sm:w-14 h-10 sm:h-14 md:w-16 md:h-16 bg-white text-black rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] z-[90] flex items-center justify-center hover:bg-gray-100 transition-colors group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare size={24} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

// --- LAPTOP FRAME ---
const LaptopFrame = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const isInView = useInView(containerRef, {
    margin: "200px 0px 0px 0px",
    once: true,
  });
  const isPlaying = useInView(containerRef, { margin: "0px 0px -200px 0px" });
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isInView && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isInView]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && shouldLoad) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, shouldLoad]);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-4xl">
      <div className="relative bg-[#1a1a1a] rounded-t-[1rem] md:rounded-t-[1.5rem] p-1.5 md:p-2 border-[1px] border-white/10 shadow-2xl">
        <div className="absolute top-2 md:top-3 left-1/2 -translate-x-1/2 w-2 h-2 md:w-2.5 md:h-2.5 bg-black rounded-full z-20" />
        <div className="relative overflow-hidden rounded-t-md md:rounded-t-lg bg-black aspect-[18/10] group">
          {shouldLoad ? (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="none"
              poster="/ezgif-frame-001.jpg"
              className="w-full h-full object-top object-cover fade-in-video"
            />
          ) : (
            <div className="w-full h-full bg-black/80 flex items-center justify-center">
              <Loader2 className="animate-spin text-white/20" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10" />
        </div>
      </div>
      <div className="relative bg-[#2b2b2b] h-2 md:h-3 rounded-b-lg md:rounded-b-xl mx-auto w-full shadow-lg flex justify-center items-center">
        <div className="w-12 md:w-16 h-1 bg-[#1a1a1a] rounded-b-md" />
      </div>
    </div>
  );
};

// --- PREMIUM PROJECT CARD ---
const PremiumProjectCard = memo(
  ({ title, category, link, color, videoSrc, index }) => {
    return (
      <div
        className="sticky top-16 sm:top-0 h-full flex flex-col justify-start sm:justify-center items-center overflow-hidden"
        style={{
          zIndex: index + 1,
        }}
      >
        <motion.div
          className="relative w-full max-w-[95vw] md:max-w-6xl px-4 sm:px-6 py-4 sm:py-6 md:px-16 md:py-8 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden flex flex-col items-center text-center shadow-2xl"
          style={{ backgroundColor: color }}
          initial={{ y: 100, scale: 0.9, opacity: 0 }}
          whileInView={{ y: 0, scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }} // Only animate once
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

          <div className="relative z-10 mb-6 md:mb-10">
            <p className="text-gray-400 text-[10px] md:text-sm uppercase tracking-[0.3em] mb-2 md:mb-4">
              {category}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-4 md:mb-6">
              {title}
            </h2>

            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white text-black rounded-full font-bold text-xs md:text-sm tracking-wide hover:scale-105 transition-transform"
            >
              Visit Website <ArrowRight size={14} className="md:w-4 md:h-4" />
            </a>
          </div>

          <div className="relative z-10 w-full hover:scale-[1.02] transition-transform duration-700">
            <LaptopFrame videoSrc={videoSrc} />
          </div>
        </motion.div>
      </div>
    );
  },
);

// --- WORK SECTION ---
const Work = () => {
  const projects = [
    {
      title: "Ownifie",
      category: "Real Estate & Interiors",
      link: "https://ownifie.com/",
      videoSrc: "/videos/Ownifie.mp4",
      color: "#0a0a0a",
    },
    {
      title: "Architectus Bureau",
      category: "Architecture Firm",
      link: "https://architectusbureau.com/",
      videoSrc: "/videos/ArchitectusBureau.mp4",
      color: "#111111",
    },
    {
      title: "BrainQBit",
      category: "AI & Education",
      link: "https://brainqbit.com/",
      videoSrc: "/videos/BrainQbit.mp4",
      color: "#050505",
    },
    {
      title: "Buildifie",
      category: "Construction Tech",
      link: "https://buildifie.com/",
      videoSrc: "/videos/Buildifie.mp4",
      color: "#0f0f0f",
    },
    {
      title: "GoPDFGo",
      category: "Productivity Tools",
      link: "https://gopdfgo.com/",
      videoSrc: "/videos/GoPDFGo.mp4",
      color: "#080808",
    },
  ];

  return (
    <section id="work" className="relative bg-black">
      <div className="py-8 sm:py-10 md:py-12 lg:py-16 px-4 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tighter mb-4">
          Selected Work.
        </h2>
        <div className="h-1 w-16 md:w-24 bg-white/20 mx-auto" />
      </div>

      <div className="pb-6 sm:pb-8 md:pb-10 lg:pb-12">
        {projects.map((proj, i) => (
          <PremiumProjectCard key={i} {...proj} index={i} />
        ))}
      </div>
    </section>
  );
};

// --- SKILL SCROLL SECTION ---
const SkillScrollSection = () => {
  const targetRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const updateScrollRange = () => {
      const scrollableWidth = element.scrollWidth;
      const viewportWidth = window.innerWidth;
      setScrollRange(scrollableWidth - viewportWidth + 100);
    };

    updateScrollRange();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollRange();
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  const skills = [
    { name: "React", folder: "react", frames: 56, color: "#61DAFB" },
    { name: "Next.js", folder: "next", frames: 72, color: "#FFFFFF" },
    { name: "Node.js", folder: "nodejs", frames: 80, color: "#339933" },
    { name: "MongoDB", folder: "mongodb", frames: 67, color: "#47A248" },
    { name: "Tailwind", folder: "tailwindcss", frames: 64, color: "#06B6D4" },
    { name: "Github", folder: "github", frames: 56, color: "#ffffff" },
    { name: "Express", folder: "express", frames: 62, color: "#ffffff" },
  ];

  return (
    <section
      ref={targetRef}
      className="relative h-[800vh] md:h-[600vh] bg-black"
    >
      <div className="sticky top-0 h-[70vh] sm:h-screen flex flex-col justify-end sm:justify-center overflow-hidden">
        <div className="absolute top-8 left-4 md:left-16 z-20 pointer-events-none">
          <p className="text-gray-500 uppercase tracking-widest text-[10px] md:text-sm mb-2">
            My Arsenal
          </p>
          <h3 className="text-3xl md:text-6xl font-bold text-white leading-tight">
            Engineering <br /> Stack.
          </h3>
        </div>

        <motion.div
          ref={scrollContainerRef}
          style={{ x }}
          className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-center pl-[20px] md:pl-[50vw] pr-[20px] md:pr-[10vw]"
        >
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              skill={skill}
              globalProgress={scrollYProgress}
              index={index}
              totalSkills={skills.length}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- SKILL CARD ---
// --- FIXED & OPTIMIZED SKILL CARD ---
const SkillCard = memo(({ skill, globalProgress, index, totalSkills }) => {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imagesRef = useRef([]); // Isme hum Images store karenge
  const cardRef = useRef(null);

  // Load only when visible
  const isInView = useInView(cardRef, { margin: "200px 0px 0px 0px", once: true });

  const step = 1 / totalSkills;
  const start = Math.max(0, index * step - 0.1);
  const end = Math.min(1, start + 0.4);

  const currentFrame = useTransform(
    globalProgress,
    [start, end],
    [0, skill.frames - 1],
  );

  useEffect(() => {
    // Agar card screen par nahi aaya hai, to load mat karo
    if (!isInView) return;

    let isCancelled = false;

    const loadImages = async () => {
      // 1. Placeholder array banao taaki indexing gadbad na ho
      const finalImagesArray = new Array(skill.frames).fill(null);
      const promises = [];

      // 2. Loop me 'i += 2' karo (Sirf Odd frames download hongi: 1, 3, 5...)
      for (let i = 1; i <= skill.frames; i += 2) {
        const promise = new Promise((resolve) => {
          const img = new Image();
          const formattedIndex = i.toString().padStart(3, "0");
          img.src = `/${skill.folder}/ezgif-frame-${formattedIndex}.jpg`;
          
          img.onload = () => resolve({ img, index: i - 1 }); // Store image & correct index
          img.onerror = () => resolve(null); // Agar error aaye to null bhejo
        });
        promises.push(promise);
      }

      // 3. Saari requests bhejo
      const results = await Promise.all(promises);

      if (!isCancelled) {
        // 4. Array Fill Logic (Gap Filling)
        results.forEach((res) => {
          if (res) {
            // Current index par image set karo
            finalImagesArray[res.index] = res.img;
            
            // MAGIC: Agla frame jo humne download nahi kiya, wahan bhi yehi image chipka do
            // Isse array complete ho jayega aur blank screen nahi aayegi
            if (res.index + 1 < skill.frames) {
              finalImagesArray[res.index + 1] = res.img;
            }
          }
        });

        // 5. Final check: Agar koi gap reh gaya ho to pichli image se bhar do
        for (let i = 1; i < finalImagesArray.length; i++) {
            if (!finalImagesArray[i] && finalImagesArray[i-1]) {
                finalImagesArray[i] = finalImagesArray[i-1];
            }
        }

        imagesRef.current = finalImagesArray;
        setIsLoaded(true);
        drawFrame(0); // Load hote hi pehla frame draw karo
      }
    };

    loadImages();

    return () => { isCancelled = true; };
  }, [skill.folder, skill.frames, isInView]);

  // --- SIMPLE DRAW LOGIC (No complex calculations) ---
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    // Check: Canvas hona chahiye aur us index par image honi chahiye
    if (!canvas || !imagesRef.current[frameIndex]) return;

    const ctx = canvas.getContext("2d");
    const img = imagesRef.current[frameIndex]; // Direct access works now!

    if (img) {
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio,
      );
    }
  };

  useEffect(() => {
    const unsubscribe = currentFrame.on("change", (latest) => {
      if (!isLoaded) return;
      
      const frameIndex = Math.floor(latest);
      // Safe Index ensure karein (Array se bahar na jaye)
      const safeIndex = Math.max(0, Math.min(skill.frames - 1, frameIndex));

      requestAnimationFrame(() => drawFrame(safeIndex));
    });

    return () => unsubscribe();
  }, [currentFrame, isLoaded, skill.frames]);

  // Resize Handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        if (isLoaded && imagesRef.current.length > 0) {
          drawFrame(0); // Resize ke baad repaint karo
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isLoaded]);

  return (
    <div 
      ref={cardRef} 
      className="relative shrink-0 w-[70vw] sm:w-[450px] md:w-[500px] lg:w-[550px] xl:w-[600px] h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh] bg-[#0d0d0d] rounded-[1.5rem] md:rounded-[2rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl group hover:border-white/30 transition-colors duration-500"
    >
      <div className="p-5 md:p-8 flex justify-between items-start z-20">
        <div>
          <h4 className="text-xl md:text-3xl font-bold text-white mb-1">
            {skill.name}
          </h4>
          <div
            className="h-1 w-8 md:w-10 rounded-full"
            style={{ backgroundColor: skill.color }}
          />
        </div>
        <div className="px-3 py-1 md:px-4 md:py-1 rounded-full border border-white/10 text-[10px] md:text-xs text-gray-400 uppercase tracking-wider backdrop-blur-md bg-white/5">
          Core Tech
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-60 group-hover:opacity-100" : "opacity-0"}`}
        />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
             {/* Loader tabhi dikhega jab user card tak scroll karega */}
             {isInView && <Loader2 className="w-8 h-8 text-white/20 animate-spin" />}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="mt-auto p-5 md:p-8 relative z-20">
        <p className="text-gray-400 text-xs md:text-sm max-w-sm leading-relaxed">
          Advanced proficiency in scalable architecture and performance
          optimization using {skill.name}.
        </p>
      </div>
    </div>
  );
});

// --- ABOUT SECTION ---
const About = () => {
  return (
    <section
      id="about"
      className="py-6 sm:py-8 md:py-10 lg:py-12 bg-black px-4 relative z-20"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tighter mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 text-center">
          About me.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 h-auto">
          <SpotlightCard className="col-span-1 md:col-span-2 p-6 md:p-10 flex flex-col justify-between group min-h-[300px]">
            <div className="absolute top-0 right-0 p-32 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all duration-500" />
            <Cpu
              size={40}
              className="text-white mb-6 relative z-10 md:w-12 md:h-12"
            />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                My Approach
              </h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                I approach every project with a focus on clarity, scalability,
                and long-term maintainability. My goal is to build products that
                feel intuitive to use, perform reliably under real-world
                conditions, and scale without unnecessary complexity. I believe
                thoughtful decisions, clean structure, and attention to detail
                are what turn good ideas into impactful digital products.
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 md:p-10 flex flex-col justify-between min-h-[250px]">
            <div className="mb-4 relative z-10">
              <span className="p-2 md:p-3 bg-blue-500/20 rounded-xl text-blue-400 block w-fit mb-4">
                <Globe size={20} className="md:w-6 md:h-6" />
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Education
              </h3>
            </div>
            <div className="relative z-10">
              <div className="mb-4">
                <p className="text-white font-bold text-sm md:text-base">
                  Master of Computer Application
                </p>
                <p className="text-gray-400 text-xs md:text-sm">
                  Lovely Professional University
                </p>
                <p className="text-gray-500 text-[10px] md:text-xs">
                  2023 - 2025
                </p>
              </div>
              <div>
                <p className="text-white font-bold text-sm md:text-base">
                  Bachelor of Computer Applications
                </p>
                <p className="text-gray-400 text-xs md:text-sm">
                  Allenhouse Institute of Technology
                </p>
                <p className="text-gray-500 text-[10px] md:text-xs">
                  2019 - 2022
                </p>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 md:p-10 flex flex-col justify-between min-h-[250px]">
            <div className="mb-4 relative z-10">
              <span className="p-2 md:p-3 bg-green-500/20 rounded-xl text-green-400 block w-fit mb-4">
                <Terminal size={20} className="md:w-6 md:h-6" />
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Tools
              </h3>
            </div>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm relative z-10">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" /> VS Code
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" /> Git
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" /> Google
                Insight
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" /> Postman
              </li>
            </ul>
          </SpotlightCard>

          <SpotlightCard className="col-span-1 md:col-span-2 p-6 md:p-10 flex flex-col justify-center overflow-hidden min-h-[300px]">
            <div className="absolute bottom-0 right-0 p-32 bg-orange-600/10 rounded-full blur-[80px]" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 relative z-10">
              Experience (3+ Years)
            </h3>
            <div className="space-y-6 border-l border-white/10 ml-2 pl-6 md:pl-8 relative z-10">
              <div className="relative">
                <div className="absolute -left-[33px] md:-left-[41px] top-1 w-4 h-4 bg-orange-500 rounded-full border-4 border-zinc-900" />
                <h4 className="text-lg md:text-xl text-white font-bold">
                  MERN Full Stack Developer
                </h4>
                <p className="text-gray-400 text-sm md:text-base">
                  Architectus Bureau • 2022 - Present
                </p>
                <p className="text-gray-500 text-xs md:text-sm mt-1">
                  MERN Full Stack Developer with 3+ years of experience,
                  specializing in scalable backend architecture and modern web
                  applications. Experienced in building high-performance MERN
                  applications with responsive UI, SEO-optimized SSR, and
                  reusable component systems. Skilled in developing secure
                  RESTful APIs, optimizing MongoDB schemas, and deploying
                  serverless solutions using AWS services. Strong collaborator
                  with expertise in Git-based workflows and production-ready
                  deployments.
                </p>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

// --- LOOP SECTION ---
const LoopSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  useLayoutEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      // Small logic tweak: Wait slightly longer to prevent jitter
      if (v >= 0.95) {
        window.scrollTo({
          top: 0,
          behavior: "auto", // Keeps it instant, which is good for loops
        });
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative bg-black text-white"
    >
      {/* Part 1: Contact Section */}
      <div className="flex flex-col justify-center items-center z-20 relative pt-20 sm:pt-0 pb-20">
        <div className="text-center z-30 mix-blend-difference">
          <p className="text-gray-500 uppercase tracking-widest mb-4 text-xs md:text-base">
            What's Next?
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tighter mb-8">
            LET'S <span className="text-gray-600">TALK.</span>
          </h2>
          <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center items-center mb-12">
            <a
              href="mailto:mohdfaiz.1842@gmail.com"
              className="inline-block px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-white text-black rounded-full text-lg md:text-xl font-bold hover:scale-105 transition-transform"
            >
              Start a Project
            </a>

            {/* Resume Button in Footer */}
            <a
              href="/Faiz_Resume.pdf"
              download
              className="flex items-center gap-2 px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 border border-white/20 bg-white/5 text-white rounded-full text-lg md:text-xl font-bold hover:bg-white hover:text-black transition-all"
            >
              <span className="hidden sm:block">Download</span> Resume{" "}
              <Download size={20} />
            </a>
          </div>

          <div className="flex gap-6 md:gap-8 mt-12 justify-center">
            <a href="https://github.com/faizsiddiqui07" target="_blank">
              <Github
                className="text-white cursor-pointer hover:text-gray-400 transition-colors"
                size={24}
              />
            </a>

            <Linkedin
              className="text-white cursor-pointer hover:text-gray-400 transition-colors"
              size={24}
            />
            <a href="mailto:mohdfaiz.1842@gmail.com">
              <Mail
                className="text-white cursor-pointer hover:text-gray-400 transition-colors"
                size={24}
              />
            </a>
          </div>
        </div>
      </div>

      <div className="h-screen relative flex flex-col justify-center items-center overflow-hidden">
        {/* Background Image - First Frame (Matches Top Hero) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/ezgif-frame-001.jpg"
            alt="Loop Start"
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
          />
          <div className="absolute inset-0" />
        </div>

        <div className="absolute z-20 text-center px-4 w-full">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter leading-none mix-blend-overlay">
            FAIZ
          </h1>
          <h1
            className="text-5xl md:text-7xl lg:text-9xl font-black text-transparent stroke-text tracking-tighter leading-none opacity-80"
            style={{ WebkitTextStroke: "2px white" }}
          >
            SIDDIQUI
          </h1>
        </div>

        <div className="absolute bottom-10 flex flex-col items-center gap-2 z-20">
          <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-white to-transparent" />
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-white">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
};

// --- MAIN PAGE ---
const Home = () => {
  const [loading, setLoading] = useState(true);

  // 🔊 GLOBAL CLICK SOUND LOGIC
  useEffect(() => {
    // Check if window is defined (Server Side Rendering safety)
    if (typeof window !== "undefined") {
      const clickSound = new Audio("/sound/click.mp3");
      clickSound.preload = "auto"; 

      const handleGlobalClick = () => {
        const soundClone = clickSound.cloneNode();
        soundClone.volume = 0.3; 
        soundClone.play().catch(() => {});
      };

      window.addEventListener("click", handleGlobalClick);

      return () => window.removeEventListener("click", handleGlobalClick);
    }
  }, []);

  return (
    <ReactLenis root>
      <div className="relative min-h-screen text-white font-sans selection:bg-white selection:text-black">
        <Background />
        <AnimatePresence mode="wait">
        {loading && <Preloader setLoading={setLoading} />}
      </AnimatePresence>

      <CustomCursor />
      <Navbar />
      <Chatbot />

      <div className="relative w-full">
        <Hero />
        <MarqueeText />
        <Work />
        <About />
        <SkillScrollSection />
        <LoopSection />
      </div>

      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      </div>
    </ReactLenis>
  );
};

export default Home;