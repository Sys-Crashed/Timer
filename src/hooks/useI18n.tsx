"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "zh" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Common
    "common.start": "开始",
    "common.pause": "暂停",
    "common.reset": "重置",
    "common.enable": "开启通知",
    // Timer page
    "timer.title": "计时器工具",
    "timer.description": "支持倒计时和秒表功能",
    "timer.clock": "时钟",
    "timer.countdown": "倒计时",
    "timer.stopwatch": "秒表",
    "timer.digital": "电子钟",
    "timer.analog": "模拟钟",
    "timer.realTime": "实时时钟、倒计时与秒表功能，随时掌握时间",
    "timer.feature.time": "实时时钟显示",
    "timer.feature.countdown": "倒计时功能",
    "timer.feature.stopwatch": "秒表计次",
    "timer.hour": "时",
    "timer.minute": "分",
    "timer.second": "秒",
    "timer.notification.title": "倒计时结束",
    "timer.notification.body": "计时器已完成！",
    "timer.today": "今天是",
  },
  en: {
    // Common
    "common.start": "Start",
    "common.pause": "Pause",
    "common.reset": "Reset",
    "common.enable": "Enable Notification",
    // Timer page
    "timer.title": "Timer Tool",
    "timer.description": "Countdown and stopwatch functionality",
    "timer.clock": "Clock",
    "timer.countdown": "Countdown",
    "timer.stopwatch": "Stopwatch",
    "timer.digital": "Digital",
    "timer.analog": "Analog",
    "timer.realTime": "Real-time clock, countdown, and stopwatch",
    "timer.feature.time": "Real-time clock",
    "timer.feature.countdown": "Countdown",
    "timer.feature.stopwatch": "Stopwatch",
    "timer.hour": "Hour",
    "timer.minute": "Min",
    "timer.second": "Sec",
    "timer.notification.title": "Countdown Complete",
    "timer.notification.body": "Timer finished!",
    "timer.today": "Today is",
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;
    if (saved === "zh" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
