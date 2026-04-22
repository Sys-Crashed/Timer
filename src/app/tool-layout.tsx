"use client";

import { useState, useEffect, useRef, createContext, useContext, ReactNode, useCallback } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Moon, Sun, Github, Mail, Youtube, Globe } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "./utils";

// I18n Context
type Language = "zh" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    "nav.back": "返回主站",
    "footer.built": "由 SysCrashed 构建",
  },
  en: {
    "nav.back": "Back to Home",
    "footer.built": "Built by SysCrashed",
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      language: "zh" as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    };
  }
  return context;
}

// Theme Context
type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "dark" as Theme,
      setTheme: () => {},
      resolvedTheme: "dark",
    };
  }
  return context;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setThemeState(saved);
      setResolvedTheme(saved);
    } else {
      // system default
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setResolvedTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setResolvedTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;
    if (saved === "zh" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

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
  children: ReactNode;
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

export function ToolLayout({ children }: ToolLayoutProps) {
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cycleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <I18nProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          {/* Header - Same style as main site */}
          <header
            className={cn(
              "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
              isScrolled
                ? "bg-background/80 backdrop-blur-md shadow-sm"
                : "bg-transparent"
            )}
          >
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
              {/* Back Link */}
              <Link href="/">
                <motion.span
                  whileHover={{ x: -4 }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("nav.back")}
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

              {/* Controls - Same style as main site */}
              <div className="flex items-center gap-2">
                {/* Language Switcher - Dropdown style like main site */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Globe className="h-5 w-5" />
                      <span className="sr-only">Toggle language</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setLanguage("zh")}
                      className={cn(language === "zh" && "bg-accent")}
                    >
                      中文
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setLanguage("en")}
                      className={cn(language === "en" && "bg-accent")}
                    >
                      English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle - Sun/Moon icons with rotation animation like main site */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cycleTheme}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex-1 pt-16">
            {children}
          </main>

          {/* Footer */}
          <footer className="py-8 px-4 border-t border-border/50">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <AnimatedSection>
                  <p className="text-sm text-muted-foreground">
                    {language === "zh" ? "由 SysCrashed 构建" : "Built by SysCrashed"}
                  </p>
                </AnimatedSection>
                <AnimatedSection delay={0.1}>
                  <div className="flex items-center gap-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <link.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    </I18nProvider>
  );
}
