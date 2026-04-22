"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock, Hourglass, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { ToolLayout } from "./tool-layout";
import { Button } from "./button";

type DisplayMode = "digital" | "analog";
type ToolMode = "clock" | "countdown" | "stopwatch";

const features = [
  { icon: Clock, text: "实时时钟显示" },
  { icon: Hourglass, text: "倒计时功能" },
  { icon: Gauge, text: "秒表计次" },
];

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function FeatureTag({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 bg-secondary rounded-full text-sm flex items-center gap-2 cursor-default"
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </motion.div>
  );
}

function DigitalClock({ time }: { time: Date }) {
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider"
    >
      <motion.span
        key={hours}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {hours}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        :
      </motion.span>
      <motion.span
        key={minutes}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {minutes}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        :
      </motion.span>
      <motion.span
        key={seconds}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-primary"
      >
        {seconds}
      </motion.span>
    </motion.div>
  );
}

function AnalogClock({ time }: { time: Date }) {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-card border-4 border-border shadow-xl"
    >
      <motion.div
        className="absolute w-2 h-20 bg-foreground rounded-sm left-1/2 bottom-1/2 -translate-x-1/2 origin-bottom"
        animate={{ rotate: hourDeg }}
        transition={{ type: "spring", stiffness: 60 }}
      />

      <motion.div
        className="absolute w-1.5 h-28 bg-foreground rounded-sm left-1/2 bottom-1/2 -translate-x-1/2 origin-bottom"
        animate={{ rotate: minuteDeg }}
        transition={{ type: "spring", stiffness: 60 }}
      />

      <motion.div
        className="absolute w-0.5 h-32 bg-red-500 rounded-full left-1/2 bottom-1/2 -translate-x-1/2 origin-bottom"
        animate={{ rotate: secondDeg }}
        transition={{ type: "linear" }}
      />

      <div className="absolute w-3 h-3 bg-red-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  );
}

function Countdown() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(5 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (remaining > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
  };

  const handleSetTime = () => {
    setIsRunning(false);
    const newTotal = minutes * 60 + seconds;
    setTotalSeconds(newTotal);
    setRemaining(newTotal);
  };

  const displayMin = Math.floor(remaining / 60);
  const displaySec = remaining % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <motion.div
        className={clsx(
          "font-mono text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6",
          remaining === 0 && "text-red-500"
        )}
      >
        {displayMin.toString().padStart(2, "0")}:
        {displaySec.toString().padStart(2, "0")}
      </motion.div>

      {!isRunning && remaining === totalSeconds && (
        <div className="flex gap-2 justify-center mb-4">
          <input
            type="number"
            min="0"
            max="99"
            value={minutes}
            onChange={e => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 px-2 py-1 text-center border border-input rounded-md bg-background"
          />
          <span className="self-center text-lg">:</span>
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={e => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            className="w-16 px-2 py-1 text-center border border-input rounded-md bg-background"
          />
        </div>
      )}

      {(remaining !== totalSeconds || isRunning) && (
        <div className="flex gap-2 justify-center mb-4">
          <Button
            variant="secondary"
            onClick={handleReset}
            className="min-w-24"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        {remaining === 0 ? (
          <Button variant="default" onClick={handleReset} className="min-w-24">
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
        ) : isRunning ? (
          <Button variant="destructive" onClick={handlePause} className="min-w-24">
            <Pause className="w-4 h-4 mr-2" />
            暂停
          </Button>
        ) : (
          <Button variant="default" onClick={remaining === totalSeconds ? handleSetTime : handleStart} className="min-w-24">
            <Play className="w-4 h-4 mr-2" />
            开始
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(l => [...l, time]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <motion.div
        className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6"
        key={time}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.1 }}
      >
        {formatTime(time)}
      </motion.div>

      <div className="flex gap-3 justify-center mb-4">
        <Button
          variant={isRunning ? "destructive" : "default"}
          onClick={() => setIsRunning(!isRunning)}
          className="min-w-24"
        >
          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? "暂停" : "开始"}
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
        {isRunning && (
          <Button variant="outline" onClick={handleLap}>
            计次
          </Button>
        )}
      </div>

      {laps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card rounded-xl p-4 border border-border max-h-48 overflow-auto"
        >
          <div className="font-medium mb-3">计次记录</div>
          {laps.map((lap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex justify-between py-2 border-b border-border last:border-0"
            >
              <span>第 {i + 1} 次</span>
              <span className="font-mono">{formatTime(lap)}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function TimerPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displayMode, setDisplayMode] = useState<DisplayMode>("digital");
  const [toolMode, setToolMode] = useState<ToolMode>("clock");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ToolLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            计时器工具
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground mb-6"
          >
          实时时钟、倒计时与秒表功能，随时掌握时间
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <FeatureTag icon={feature.icon} text={feature.text} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tool Section */}
      <section className="py-6 px-4">
        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 mb-8 justify-center"
        >
          <Button
            variant={toolMode === "clock" ? "default" : "secondary"}
            onClick={() => setToolMode("clock")}
            className="min-w-20"
          >
            时钟
          </Button>
          <Button
            variant={toolMode === "countdown" ? "default" : "secondary"}
            onClick={() => setToolMode("countdown")}
            className="min-w-20"
          >
            倒计时
          </Button>
          <Button
            variant={toolMode === "stopwatch" ? "default" : "secondary"}
            onClick={() => setToolMode("stopwatch")}
            className="min-w-20"
          >
            秒表
          </Button>
        </motion.div>

        {toolMode === "stopwatch" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center"
          >
            <Stopwatch />
          </motion.div>
        ) : toolMode === "countdown" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center"
          >
            <Countdown />
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-6 flex justify-center"
            >
              {displayMode === "digital" ? (
                <DigitalClock time={currentTime} />
              ) : (
                <AnalogClock time={currentTime} />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-2 mb-6 justify-center"
            >
              <Button
                variant={displayMode === "digital" ? "default" : "outline"}
                size="sm"
                onClick={() => setDisplayMode("digital")}
              >
                电子钟
              </Button>
              <Button
                variant={displayMode === "analog" ? "default" : "outline"}
                size="sm"
                onClick={() => setDisplayMode("analog")}
              >
                模拟钟
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-base md:text-lg text-muted-foreground text-center"
            >
              {currentTime.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long"
              })}
            </motion.div>
          </>
        )}
      </section>
    </ToolLayout>
  );
}
