import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const savedTheme = window.localStorage.getItem('theme-preference');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Standardize to dark mode if no previous preference is set
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true; 
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      window.localStorage.setItem('theme-preference', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('theme-preference', 'light');
    }
  }, [isDark]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsDark(!isDark)}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-xl h-10 w-10 relative overflow-hidden bg-background/20 hover:bg-primary/5 active:scale-95 transition-all duration-200 border-border"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 90 : 0, scale: isDark ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-amber-500 fill-amber-500/10 stroke-[2.2px]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : -90, scale: isDark ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-purple-400 fill-purple-400/10 stroke-[2.2px]" />
      </motion.div>
    </Button>
  );
}
