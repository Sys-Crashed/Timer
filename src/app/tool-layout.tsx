"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Moon, Sun, Github, Mail, Youtube } from "lucide-react";
import { Button } from "./button";

interface ToolLayoutProps {
  children: React.ReactNode;
}

const socialLinks = [
  { name: "GitHub", href: "https://github.com/Sys-Crashed", icon: Github },
  { name: "Email", href: "mailto:syscrashed@outlook.com", icon: Mail },
  { name: "YouTube", href: "https://www.youtube.com/@SysCrashed", icon: Youtube },
];

function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HoverScale({
  children,
  className,
  scale = 1.05,
}: {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ToolLayout({ children }: ToolLayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Back Link */}
          <Link href="/">
            <motion.span
              whileHover={{ x: -4 }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              返回主站
            </motion.span>
          </Link>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold tracking-tight"
              >
                SysCrashed
              </motion.span>
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <HoverScale>
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? (
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </Button>
          </HoverScale>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer - 与主站完全一致 */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <AnimatedSection delay={0}>
              <div className="space-y-4">
                <h3 className="text-lg font-bold">SysCrashed</h3>
                <p className="text-sm text-muted-foreground">
                  全栈开发者，分享技术见解与项目经验。
                </p>
              </div>
            </AnimatedSection>

            {/* Quick Links */}
            <AnimatedSection delay={0.1}>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider">
                  快捷链接
                </h4>
                <div className="flex flex-col gap-2">
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    博客
                  </Link>
                  <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    项目
                  </Link>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    关于
                  </Link>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    联系
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Social */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider">
                  社交媒体
                </h4>
                <div className="flex gap-2">
                  {socialLinks.map((link) => (
                    <HoverScale key={link.name} scale={1.1}>
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.name}
                        >
                          <link.icon className="h-5 w-5" />
                        </a>
                      </Button>
                    </HoverScale>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.3}>
            <div className="mt-8 pt-8 border-t text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} SysCrashed. All rights reserved.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </footer>
    </div>
  );
}
